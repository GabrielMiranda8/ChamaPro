package com.cefet.chamapro.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.cefet.chamapro.dto.MensagemRequestDTO;
import com.cefet.chamapro.dto.MensagemResponseDTO;
import com.cefet.chamapro.entity.Mensagem;
import com.cefet.chamapro.entity.Pedido;
import com.cefet.chamapro.entity.Usuario;
import com.cefet.chamapro.exception.BusinessException;
import com.cefet.chamapro.exception.ResourceNotFoundException;
import com.cefet.chamapro.repository.MensagemRepository;
import com.cefet.chamapro.repository.PedidoRepository;
import com.cefet.chamapro.repository.UsuarioRepository;

@Service
public class MensagemService {

    @Autowired
    private MensagemRepository mensagemRepository;

    @Autowired
    private PedidoRepository pedidoRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    // Confere se o usuário faz parte do pedido (é o cliente ou o profissional).
    // Usado tanto pra enviar quanto pra listar o histórico — ninguém de fora
    // do pedido pode ver ou mandar mensagem nessa conversa.
    private void validarParticipante(Pedido pedido, String idUsuario) {
        boolean ehCliente = pedido.getCliente().getId().equals(idUsuario);
        boolean ehProfissional = pedido.getProfissional().getId().equals(idUsuario);

        if (!ehCliente && !ehProfissional) {
            throw new BusinessException("Você não faz parte dessa conversa.");
        }
    }

    @Transactional
    public MensagemResponseDTO inserir(String idUsuarioRemetente, MensagemRequestDTO dto) {

        Pedido pedido = pedidoRepository.findById(dto.getIdPedido())
                .orElseThrow(() -> new ResourceNotFoundException("Pedido não encontrado. Id: " + dto.getIdPedido()));

        validarParticipante(pedido, idUsuarioRemetente);

        Usuario remetente = usuarioRepository.findById(idUsuarioRemetente)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado. Id: " + idUsuarioRemetente));

        Mensagem mensagem = new Mensagem();
        mensagem.setPedido(pedido);
        mensagem.setRemetente(remetente);
        mensagem.setTexto(dto.getTexto());
        mensagem.setData(LocalDateTime.now());
        mensagem.setLida(false);

        return new MensagemResponseDTO(mensagemRepository.save(mensagem));
    }

    @Transactional(readOnly = true)
    public List<MensagemResponseDTO> listarPorPedido(String idPedido, String idUsuarioLogado) {

        Pedido pedido = pedidoRepository.findById(idPedido)
                .orElseThrow(() -> new ResourceNotFoundException("Pedido não encontrado. Id: " + idPedido));

        validarParticipante(pedido, idUsuarioLogado);

        List<Mensagem> mensagens = mensagemRepository.findByPedido_IdOrderByDataAsc(idPedido);

        return mensagens.stream().map(MensagemResponseDTO::new).toList();
    }

    @Transactional
    public void marcarComoLidas(String idPedido, String idUsuarioLogado) {
        List<Mensagem> naoLidas = mensagemRepository.findByPedido_IdAndLidaFalseAndRemetente_IdNot(idPedido, idUsuarioLogado);

        for (int i = 0; i < naoLidas.size(); i++) {
            naoLidas.get(i).setLida(true);
        }

        mensagemRepository.saveAll(naoLidas);
    }
}