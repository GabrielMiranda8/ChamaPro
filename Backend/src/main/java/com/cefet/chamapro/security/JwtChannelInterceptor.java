package com.cefet.chamapro.security;

import java.security.Principal;

import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.stereotype.Component;

@Component
public class JwtChannelInterceptor implements ChannelInterceptor {

    private final JwtUtil jwtUtil;

    public JwtChannelInterceptor(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel) {
        StompHeaderAccessor accessor = MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);

        if (accessor == null) {
            return message;
        }

        // A autenticação só precisa acontecer uma vez, no CONNECT inicial.
        // Depois disso, a sessão STOMP já carrega o Principal nas mensagens seguintes.
        if (StompCommand.CONNECT.equals(accessor.getCommand())) {
            String header = accessor.getFirstNativeHeader("Authorization");

            if (header == null || !header.startsWith("Bearer ")) {
                throw new IllegalArgumentException("Token ausente na conexão do chat.");
            }

            String token = header.substring(7);

            if (!jwtUtil.tokenValido(token)) {
                throw new IllegalArgumentException("Token inválido ou expirado.");
            }

            String idUsuario = jwtUtil.extrairId(token);

            // Principal simples baseado no id do usuário. É esse valor que
            // fica disponível depois via Principal.getName() nos @MessageMapping.
            Principal principal = () -> idUsuario;
            accessor.setUser(principal);
        }

        return message;
    }
}