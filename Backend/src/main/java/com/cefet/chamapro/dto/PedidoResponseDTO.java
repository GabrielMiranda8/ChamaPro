package com.cefet.chamapro.dto;

import java.math.BigDecimal;
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
    private Date data;
    private String idEndereco;
    private BigDecimal preco;
    private Status status;

    public PedidoResponseDTO(Pedido pedido) {
    	this.id = pedido.getId();
        this.idServico = pedido.getServico().getId();
        this.nomeServico = pedido.getServico().getNome();
        this.idCliente = pedido.getCliente().getId();
        this.nomeCliente = pedido.getCliente().getNome();
        this.idProfissional = pedido.getProfissional().getId();
        this.nomeProfissional = pedido.getProfissional().getNome();
        this.data = pedido.getData();
        this.idEndereco = pedido.getEndereco().getId();
        this.preco = pedido.getPreco();
        this.status = pedido.getStatus();
    }

}