package com.cefet.chamapro.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;

import com.cefet.chamapro.entity.Compromisso;
import com.cefet.chamapro.entity.Endereco;

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
    private String endereco;
    private String descricao;
    private BigDecimal preco;
    private LocalDate dataInicio;
    private LocalDate dataFim;
    private LocalTime horaInicio;
    private LocalTime horaFim;

    public CompromissoResponseDTO(Compromisso compromisso) {
        this.id = compromisso.getId();
        this.idPedido = compromisso.getPedido().getId();
        this.nomeServico = compromisso.getPedido().getServico().getNome();
        this.nomeCliente = compromisso.getPedido().getCliente().getNome();
        this.descricao = compromisso.getPedido().getDescricao();
        this.preco = compromisso.getPedido().getPreco();
        this.dataInicio = compromisso.getDataInicio();
        this.dataFim = compromisso.getDataFim();
        this.horaInicio = compromisso.getHoraInicio();
        this.horaFim = compromisso.getHoraFim();

        Endereco end = compromisso.getPedido().getEndereco();
        String enderecoTexto = "";

        if (end != null) {
            if (end.getRua() != null) {
                enderecoTexto = end.getRua();
            }
            if (end.getNumero() != null) {
                enderecoTexto = enderecoTexto + ", " + end.getNumero();
            }
            if (end.getBairro() != null && !end.getBairro().isEmpty()) {
                enderecoTexto = enderecoTexto + " — " + end.getBairro();
            }
        }

        this.endereco = enderecoTexto;
    }
}