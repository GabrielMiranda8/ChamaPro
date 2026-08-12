package com.cefet.chamapro.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class AvaliacaoRequestDTO {

    @NotBlank(message = "O campo autorId é obrigatório")
    private String autorId;

    @NotBlank(message = "O campo alvoId é obrigatório")
    private String alvoId;

    @NotBlank(message = "O campo pedidoId é obrigatório")
    private String pedidoId;

    @NotBlank(message = "O campo nota é obrigatório")
    private BigDecimal nota;

    @NotNull(message = "O campo data é obrigatório")
    private LocalDateTime data;

    private String descricao;


}