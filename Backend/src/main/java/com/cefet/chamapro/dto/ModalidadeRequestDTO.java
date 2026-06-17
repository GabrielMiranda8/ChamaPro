package com.cefet.chamapro.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class ModalidadeRequestDTO {

    @NotBlank(message = "A descrição é obrigatória.")
    private String descricao;

}