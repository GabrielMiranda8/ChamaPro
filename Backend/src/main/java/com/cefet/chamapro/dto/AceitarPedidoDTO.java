package com.cefet.chamapro.dto;

import java.time.LocalDate;
import java.time.LocalTime;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class AceitarPedidoDTO {

    @NotNull(message = "O campo dataInicio é obrigatório")
    private LocalDate dataInicio;

    @NotNull(message = "O campo dataFim é obrigatório")
    private LocalDate dataFim;

    @NotNull(message = "O campo horaInicio é obrigatório")
    private LocalTime horaInicio;

    @NotNull(message = "O campo horaFim é obrigatório")
    private LocalTime horaFim;
}