package com.cefet.chamapro.dto;

import java.time.LocalDate;
import java.time.LocalTime;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class AceitarPedidoDTO {

    @NotNull(message = "O campo data é obrigatório")
    private LocalDate data;

    @NotNull(message = "O campo horaInicio é obrigatório")
    private LocalTime horaInicio;

    @NotNull(message = "O campo horaFim é obrigatório")
    private LocalTime horaFim;
}