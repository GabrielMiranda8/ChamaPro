package com.cefet.chamapro.dto;

import jakarta.validation.constraints.NotBlank;

public record ProfissionalRequestDTO(
        @NotBlank(message = "Id é obrigatório")
        String id

) {}