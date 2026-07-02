package com.cefet.chamapro.controller;

import com.cefet.chamapro.dto.LoginRequestDTO;
import com.cefet.chamapro.dto.LoginResponseDTO;
import com.cefet.chamapro.entity.Usuario;
import com.cefet.chamapro.repository.UsuarioRepository;
import com.cefet.chamapro.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = {"http://localhost:8100", "http://localhost:4200"})
@RequiredArgsConstructor
public class AuthController {

    private final UsuarioRepository repository;
    private final JwtUtil jwtUtil;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequestDTO dto) {
        Usuario usuario = repository.findByEmail(dto.getEmail()).orElse(null);

        if (usuario == null || !usuario.getSenha().equals(dto.getSenha())) {
            return ResponseEntity.status(401).body("Email ou senha inválidos");
        }

        return ResponseEntity.ok(new LoginResponseDTO(jwtUtil.gerarToken(usuario)));
    }
}