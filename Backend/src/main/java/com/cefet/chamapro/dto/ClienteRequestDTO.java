package com.cefet.chamapro.dto;

import jakarta.validation.constraints.NotBlank;

public record ClienteRequestDTO(
        @NotBlank(message = "Id é obrigatório")
        String id
) {}