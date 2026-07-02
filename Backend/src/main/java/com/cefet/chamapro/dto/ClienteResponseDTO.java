package com.cefet.chamapro.dto;

import java.util.Date;

public record ClienteResponseDTO(
        String id,
        String nome,
        String email,
        Date dtNasc,
        Date dtConta,
        Double nota
) {}