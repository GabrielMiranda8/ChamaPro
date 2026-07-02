package com.cefet.chamapro.dto;

import java.util.Date;

public record UsuarioResponseDTO(
        String id,
        String nome,
        Date dtNasc,
        Date dtConta,
        Double nota
) {}