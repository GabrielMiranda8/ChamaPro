package com.cefet.chamapro.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.cefet.chamapro.dto.AvaliacaoRequestDTO;
import com.cefet.chamapro.dto.AvaliacaoResponseDTO;
import com.cefet.chamapro.entity.Avaliacao;
import com.cefet.chamapro.entity.Pedido;
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

    @Transactional
    public AvaliacaoResponseDTO inserir(AvaliacaoRequestDTO dto) {
        if (aRepository.existsByAutor_IdAndAlvo_IdAndPedido_Id(dto.getAutorId(), dto.getAlvoId(), dto.getPedidoId())) {
            throw new BusinessException("Avaliação já existente para o autor, alvo e pedido especificados.");
        }

        Pedido pedido = pedidoRepository.findById(dto.getPedidoId())
                .orElseThrow(() -> new ResourceNotFoundException("Pedido não encontrado. Id: " + dto.getPedidoId()));

        Usuario autor = usuarioRepository.findById(dto.getAutorId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Autor não encontrado. Id: " + dto.getAutorId()));

        Usuario alvo = usuarioRepository.findById(dto.getAlvoId())
                .orElseThrow(() -> new ResourceNotFoundException("Alvo não encontrado. Id: " + dto.getAlvoId()));

        Avaliacao a = new Avaliacao();
        a.setAutor(autor);
        a.setAlvo(alvo);
        a.setData(dto.getData());
        a.setDescricao(dto.getDescricao());
        a.setNota(dto.getNota());
        a.setPedido(pedido);

        return new AvaliacaoResponseDTO(aRepository.save(a));
    }

    @Transactional
    public AvaliacaoResponseDTO atualizar(String id, AvaliacaoRequestDTO dto) {
        Avaliacao a = aRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Avaliacao não encontrada. Id: " + id));

        Pedido pedido = pedidoRepository.findById(dto.getPedidoId())
                .orElseThrow(() -> new ResourceNotFoundException("Pedido não encontrado. Id: " + dto.getPedidoId()));

        Usuario autor = usuarioRepository.findById(dto.getAutorId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Autor não encontrado. Id: " + dto.getAutorId()));

        Usuario alvo = usuarioRepository.findById(dto.getAlvoId())
                .orElseThrow(() -> new ResourceNotFoundException("Alvo não encontrado. Id: " + dto.getAlvoId()));
            
        a.setAlvo(alvo);
        a.setAutor(autor);
        a.setData(dto.getData());
        a.setDescricao(dto.getDescricao());
        a.setNota(dto.getNota());
        a.setPedido(pedido);

        return new AvaliacaoResponseDTO(aRepository.save(a));
    }


    @Transactional
    public void excluir(String id) {
        if (!aRepository.existsById(id)) {
            throw new ResourceNotFoundException("Avaliacao não encontrada com ID: " + id);
        }
        aRepository.deleteById(id);
    }
}