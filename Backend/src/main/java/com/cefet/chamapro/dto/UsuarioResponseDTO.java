package com.cefet.chamapro.dto;

import java.util.Date;

public record UsuarioResponseDTO(
        String id,
        String nome,
        String email,
        String cpf,
        Date dtNasc,
        Date dtConta,
        Number nota,
        String tipo
) {}