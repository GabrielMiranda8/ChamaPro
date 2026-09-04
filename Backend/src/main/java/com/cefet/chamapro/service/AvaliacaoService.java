package com.cefet.chamapro.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.cefet.chamapro.dto.AvaliacaoRequestDTO;
import com.cefet.chamapro.dto.AvaliacaoResponseDTO;
import com.cefet.chamapro.entity.Avaliacao;
import com.cefet.chamapro.entity.Pedido;
import com.cefet.chamapro.entity.Status;
import com.cefet.chamapro.entity.Usuario;
import com.cefet.chamapro.exception.BusinessException;
import com.cefet.chamapro.exception.ResourceNotFoundException;
import com.cefet.chamapro.repository.AvaliacaoRepository;
import com.cefet.chamapro.repository.PedidoRepository;
import com.cefet.chamapro.repository.UsuarioRepository;

@Service
public class AvaliacaoService {

    @Autowired
    private AvaliacaoRepository aRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PedidoRepository pedidoRepository;

    @Transactional(readOnly = true)
    public List<AvaliacaoResponseDTO> listar() {
        List<Avaliacao> as = aRepository.findAll();
        return as.stream().map(AvaliacaoResponseDTO::new).toList();
    }

    @Transactional(readOnly = true)
    public AvaliacaoResponseDTO buscarPorId(String id) {
        Avaliacao a = aRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Avaliacao não encontrada. Id: " + id));
        return new AvaliacaoResponseDTO(a);
    }

    @Transactional(readOnly = true)
    public List<AvaliacaoResponseDTO> listarPorAutor(String idAutor) {
        if (!usuarioRepository.existsById(idAutor)) {
            throw new ResourceNotFoundException("Autor não encontrado. Id: " + idAutor);
        }

        return aRepository.findByAutor_Id(idAutor)
                .stream()
                .map(AvaliacaoResponseDTO::new)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<AvaliacaoResponseDTO> listarPorAlvo(String idAlvo) {
        if (!usuarioRepository.existsById(idAlvo)) {
            throw new ResourceNotFoundException("Alvo não encontrado. Id: " + idAlvo);
        }

        return aRepository.findByAlvo_Id(idAlvo)
                .stream()
                .map(AvaliacaoResponseDTO::new)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<AvaliacaoResponseDTO> listarPorPedido(String idPedido) {
        if (!pedidoRepository.existsById(idPedido)) {
            throw new ResourceNotFoundException("Pedido não encontrado. Id: " + idPedido);
        }

        return aRepository.findByPedido_Id(idPedido)
                .stream()
                .map(AvaliacaoResponseDTO::new)
                .toList();
    }

    @Transactional
    public AvaliacaoResponseDTO inserir(AvaliacaoRequestDTO dto) {
        if (aRepository.existsByAutor_IdAndAlvo_IdAndPedido_Id(dto.getAutorId(), dto.getAlvoId(), dto.getPedidoId())) {
            throw new BusinessException("Avaliação já existente para o autor, alvo e pedido especificados.");
        }

        Pedido pedido = pedidoRepository.findById(dto.getPedidoId())
                .orElseThrow(() -> new ResourceNotFoundException("Pedido não encontrado. Id: " + dto.getPedidoId()));

        if (pedido.getStatus() != Status.FINALIZADO) {
            throw new BusinessException("Só é possível avaliar pedidos finalizados.");
        }

        Usuario autor = usuarioRepository.findById(dto.getAutorId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Autor não encontrado. Id: " + dto.getAutorId()));

        Usuario alvo = usuarioRepository.findById(dto.getAlvoId())
                .orElseThrow(() -> new ResourceNotFoundException("Alvo não encontrado. Id: " + dto.getAlvoId()));

        if (autor.getId().equals(alvo.getId())) {
            throw new BusinessException("Não é possível avaliar a si mesmo.");
        }

        validarParticipantesDoPedido(pedido, autor.getId(), alvo.getId());

        Avaliacao a = new Avaliacao();
        a.setAutor(autor);
        a.setAlvo(alvo);
        a.setData(LocalDateTime.now());
        a.setDescricao(dto.getDescricao());
        a.setNota(dto.getNota());
        a.setPedido(pedido);

        Avaliacao salva = aRepository.save(a);

        recalcularNota(alvo.getId());

        return new AvaliacaoResponseDTO(salva);
    }

    @Transactional
    public AvaliacaoResponseDTO atualizar(String id, AvaliacaoRequestDTO dto) {
        Avaliacao a = aRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Avaliacao não encontrada. Id: " + id));

        // Autor, alvo e pedido de uma avaliação já cadastrada não podem ser
        // trocados por aqui - só a nota e o comentário podem ser editados.
        a.setDescricao(dto.getDescricao());
        a.setNota(dto.getNota());

        Avaliacao salva = aRepository.save(a);

        recalcularNota(a.getAlvo().getId());

        return new AvaliacaoResponseDTO(salva);
    }


    @Transactional
    public void excluir(String id) {
        Avaliacao a = aRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Avaliacao não encontrada com ID: " + id));

        String idAlvo = a.getAlvo().getId();

        aRepository.deleteById(id);

        recalcularNota(idAlvo);
    }

    // ─── Helpers ────────────────────────────────────────────────────────────

    // Garante que autor e alvo realmente fazem parte do pedido informado (ou
    // seja, um é o cliente e o outro o profissional daquele pedido), evitando
    // que qualquer usuário avalie qualquer outro usando um pedido alheio.
    private void validarParticipantesDoPedido(Pedido pedido, String idAutor, String idAlvo) {
        String idCliente = pedido.getCliente().getId();
        String idProfissional = pedido.getProfissional().getId();

        boolean clienteAvaliaProfissional = idAutor.equals(idCliente) && idAlvo.equals(idProfissional);
        boolean profissionalAvaliaCliente = idAutor.equals(idProfissional) && idAlvo.equals(idCliente);

        if (!clienteAvaliaProfissional && !profissionalAvaliaCliente) {
            throw new BusinessException("Autor e alvo precisam ser o cliente e o profissional do pedido informado.");
        }
    }

    // Recalcula a nota média de um usuário com base em todas as avaliações
    // recebidas por ele, e persiste o novo valor em tb_usuario.nota. É essa
    // chamada que faz a nota do profissional (ou do cliente) mudar depois
    // de cada avaliação nova, editada ou removida.
    private void recalcularNota(String idUsuarioAlvo) {
        Usuario usuario = usuarioRepository.findById(idUsuarioAlvo).orElse(null);
        if (usuario == null) {
            return;
        }

        List<Avaliacao> avaliacoes = aRepository.findByAlvo_Id(idUsuarioAlvo);

        if (avaliacoes.isEmpty()) {
            usuario.setNota(0.0);
        } else {
            double media = avaliacoes.stream()
                    .mapToDouble(av -> av.getNota().doubleValue())
                    .average()
                    .orElse(0.0);
            usuario.setNota(Math.round(media * 10.0) / 10.0);
        }

        usuarioRepository.save(usuario);
    }
}
