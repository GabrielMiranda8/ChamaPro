package com.cefet.chamapro.dto;

import java.time.LocalDate;
import java.time.LocalTime;

import com.cefet.chamapro.entity.Compromisso;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class CompromissoResponseDTO {

    private String id;
    private String idPedido;
    private String nomeServico;
    private String nomeCliente;
    private LocalDate data;
    private LocalTime horaInicio;
    private LocalTime horaFim;

    public CompromissoResponseDTO(Compromisso compromisso) {
        this.id = compromisso.getId();
        this.idPedido = compromisso.getPedido().getId();
        this.nomeServico = compromisso.getPedido().getServico().getNome();
        this.nomeCliente = compromisso.getPedido().getCliente().getNome();
        this.data = compromisso.getData();
        this.horaInicio = compromisso.getHoraInicio();
        this.horaFim = compromisso.getHoraFim();
    }
}