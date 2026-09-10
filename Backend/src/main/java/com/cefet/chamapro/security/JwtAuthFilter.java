package com.cefet.chamapro.security;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;

    public JwtAuthFilter(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String header = request.getHeader("Authorization");

        if (header == null || !header.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        String token = header.substring(7);

        if (!jwtUtil.tokenValido(token)) {
            filterChain.doFilter(request, response);
            return;
        }

        String idUsuario = jwtUtil.extrairId(token);
        String tipoUsuario = jwtUtil.extrairTipo(token);

        // O "name" da Authentication é o id do usuário — é isso que o
        // TokenUsuarioResolver e o SecurityContextHolder vão devolver depois,
        // tanto aqui no REST quanto (de forma equivalente) no WebSocket.
        List<GrantedAuthority> authorities = new ArrayList<>();
        if (tipoUsuario != null) {
            authorities.add(new SimpleGrantedAuthority("ROLE_" + tipoUsuario));
        }

        UsernamePasswordAuthenticationToken authentication =
                new UsernamePasswordAuthenticationToken(idUsuario, null, authorities);

        SecurityContextHolder.getContext().setAuthentication(authentication);

        filterChain.doFilter(request, response);
    }
}