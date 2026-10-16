package com.cefet.chamapro.config;

import java.util.List;

import org.springframework.boot.autoconfigure.graphql.GraphQlProperties.Http;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import com.cefet.chamapro.security.JwtAuthFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;

    public SecurityConfig(JwtAuthFilter jwtAuthFilter) {
        this.jwtAuthFilter = jwtAuthFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        // Preflight sempre livre, senão o browser bloqueia tudo que exige auth
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        .requestMatchers("/auth/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/usuarios").permitAll()
                        // REMOVER DEPOIS
                        .requestMatchers(HttpMethod.POST, "/enderecos/geocodificar-pendentes").permitAll()
                        .requestMatchers(HttpMethod.GET, "/caracteristicas").permitAll()
                        .requestMatchers("/ws-chat/**").permitAll()
                        .requestMatchers("/v3/api-docs/**", "/swagger-ui/**").permitAll()
                        // Sem isso, qualquer erro (400, 404, 415, 500) é redirecionado internamente
                        // para /error, que exige login, e o cliente vê um 403 enganoso.
                        .requestMatchers("/error").permitAll()

                        // ===== Restrições por perfil (403 Forbidden se o tipo do token não bater) =====
                        // Pedidos: POST aberto (Cliente e Profissional podem pedir); só PROFISSIONAL aceita/recusa
                        .requestMatchers(HttpMethod.PATCH, "/pedidos/*/aceitar", "/pedidos/*/recusar")
                                .hasRole("PROFISSIONAL")

                        // Serviços oferecidos: só PROFISSIONAL gerencia os seus
                        .requestMatchers(HttpMethod.POST, "/profissionalservico/**").hasRole("PROFISSIONAL")
                        .requestMatchers(HttpMethod.PUT, "/profissionalservico/**").hasRole("PROFISSIONAL")
                        .requestMatchers(HttpMethod.DELETE, "/profissionalservico/**").hasRole("PROFISSIONAL")

                        // Catálogo (Serviço e Característica): escrita só pelos ADMs direto no banco -> sempre 403
                        .requestMatchers(HttpMethod.POST, "/servicos/**", "/caracteristicas/**").denyAll()
                        .requestMatchers(HttpMethod.PUT, "/servicos/**", "/caracteristicas/**").denyAll()
                        .requestMatchers(HttpMethod.PATCH, "/servicos/**", "/caracteristicas/**").denyAll()
                        .requestMatchers(HttpMethod.DELETE, "/servicos/**", "/caracteristicas/**").denyAll()

                        // Cadastros específicos de cada perfil (escrita)
                        .requestMatchers(HttpMethod.POST, "/clientes/**").hasRole("CLIENTE")
                        .requestMatchers(HttpMethod.PUT, "/clientes/**").hasRole("CLIENTE")
                        .requestMatchers(HttpMethod.DELETE, "/clientes/**").hasRole("CLIENTE")
                        .requestMatchers(HttpMethod.POST, "/profissionais/**").hasRole("PROFISSIONAL")
                        .requestMatchers(HttpMethod.PUT, "/profissionais/**").hasRole("PROFISSIONAL")
                        .requestMatchers(HttpMethod.DELETE, "/profissionais/**").hasRole("PROFISSIONAL")

                        // Demais rotas: qualquer usuário autenticado (CLIENTE ou PROFISSIONAL)
                        .anyRequest().authenticated())
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowCredentials(true);
        config.setAllowedOriginPatterns(List.of("*")); // TESTE URGENTE, REMOVER DEPOIS E VOLTAR PARA A SEGURANCA
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setExposedHeaders(List.of("Authorization"));
        config.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }

}
