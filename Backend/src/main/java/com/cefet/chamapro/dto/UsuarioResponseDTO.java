package com.cefet.chamapro.dto;

public record UsuarioResponseDTO(
        Long id,
        String nome,
        String email,
        String cpf,
        String dtNasc,
        String dtConta,
        Number nota,
        String tipo
) {}