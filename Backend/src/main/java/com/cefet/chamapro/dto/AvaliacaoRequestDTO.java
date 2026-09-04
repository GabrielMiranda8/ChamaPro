package com.cefet.chamapro.dto;

import java.math.BigDecimal;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
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

    @NotNull(message = "O campo nota é obrigatório")
    @DecimalMin(value = "1.0", message = "A nota mínima é 1.0")
    @DecimalMax(value = "5.0", message = "A nota máxima é 5.0")
    private BigDecimal nota;

    // A data é definida pelo próprio servidor no momento do cadastro.
    private String descricao;


}
