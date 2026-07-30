package com.cefet.chamapro.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class CaracteristicaUsuarioRequestDTO {
    // Os dados que o Usuário envia
    @NotNull(message = "O campo idCaracteristica é obrigatório")
    private String idCaracteristica;

    @NotNull(message = "O campo idUsuario é obrigatório")
    private String idUsuario;

    @NotNull(message = "O campo tem é obrigatório")
    private boolean tem;

    @NotNull(message = "O campo lida é obrigatório")
    private boolean lida;
}