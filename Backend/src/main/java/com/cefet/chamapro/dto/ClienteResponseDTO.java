package com.cefet.chamapro.dto;

public record ClienteResponseDTO(
        Long id,
        String nome,
        String email,
        String cpf,
        String dtNasc,
        String dtConta,
        Number nota
) {}