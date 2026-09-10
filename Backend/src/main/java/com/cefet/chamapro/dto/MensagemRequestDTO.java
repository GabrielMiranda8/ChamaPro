package com.cefet.chamapro.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class MensagemRequestDTO {

    @NotBlank(message = "O campo idPedido é obrigatório")
    private String idPedido;

    @NotBlank(message = "O campo texto é obrigatório")
    private String texto;
}