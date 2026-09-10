package com.cefet.chamapro.controller;

import java.security.Principal;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import com.cefet.chamapro.dto.MensagemRequestDTO;
import com.cefet.chamapro.dto.MensagemResponseDTO;
import com.cefet.chamapro.service.MensagemService;

@Controller
public class ChatController {

    @Autowired
    private MensagemService mensagemService;

    @Autowired
    private SimpMessagingTemplate template;

    @MessageMapping("/pedido/{idPedido}/enviar")
    public void enviar(@DestinationVariable String idPedido, @Payload MensagemRequestDTO dto, Principal principal) {
        // principal.getName() é o id do usuário, setado pelo JwtChannelInterceptor
        // no CONNECT — o remetente nunca vem do corpo da mensagem.
        MensagemResponseDTO salva = mensagemService.inserir(principal.getName(), dto);

        template.convertAndSend("/topico/pedido/" + idPedido, salva);
    }
}