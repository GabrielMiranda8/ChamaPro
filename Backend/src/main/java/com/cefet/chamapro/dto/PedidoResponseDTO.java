package com.cefet.chamapro.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Date;

import com.cefet.chamapro.entity.Pedido;
import com.cefet.chamapro.entity.Status;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class PedidoResponseDTO {

    private String id;
    private String idServico;
    private String nomeServico;
    private String idCliente;
    private String nomeCliente;
    private String idProfissional;
    private String nomeProfissional;
    private String idEndereco;
    private BigDecimal preco;
    private Status status;
    private LocalDate dataSugerida;
    private LocalTime horaSugerida;
    private LocalDate dataAgendadaInicial;
    private LocalDate dataAgendadaFinal;
    private LocalTime horaInicioAgendada;
    private LocalTime horaFimAgendada;

    public PedidoResponseDTO(Pedido pedido) {
        this.id = pedido.getId();
        this.idServico = pedido.getServico().getId();
        this.nomeServico = pedido.getServico().getNome();
        this.idCliente = pedido.getCliente().getId();
        this.nomeCliente = pedido.getCliente().getNome();
        this.idProfissional = pedido.getProfissional().getId();
        this.nomeProfissional = pedido.getProfissional().getNome();
        this.idEndereco = pedido.getEndereco().getId();
        this.preco = pedido.getPreco();
        this.status = pedido.getStatus();
        this.dataSugerida = pedido.getDataSugerida();
        this.horaSugerida = pedido.getHoraSugerida();

        if (pedido.getCompromisso() != null && pedido.getCompromisso().isAtivo()) {
            this.dataAgendadaInicial = pedido.getCompromisso().getDataInicio();
            this.dataAgendadaFinal = pedido.getCompromisso().getDataFim();
            this.horaInicioAgendada = pedido.getCompromisso().getHoraInicio();
            this.horaFimAgendada = pedido.getCompromisso().getHoraFim();
        }
    }

}