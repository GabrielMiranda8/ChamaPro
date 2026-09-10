package com.cefet.chamapro.security;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
public class TokenUsuarioResolver {

    // Assume que o JwtAuthFilter já populou o SecurityContext com um
    // Principal cujo getName() é o id do usuário — mesmo padrão usado
    // no JwtChannelInterceptor do lado WebSocket.
    public String idDoUsuarioAutenticado() {
        return SecurityContextHolder.getContext().getAuthentication().getName();
    }
}