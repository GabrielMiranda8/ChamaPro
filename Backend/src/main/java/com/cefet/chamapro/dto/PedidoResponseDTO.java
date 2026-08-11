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
    private String idCliente;
    private String idProfissional;
    private Date data;
    private String idEndereco;
    private BigDecimal preco;
    private Status status;

    public PedidoResponseDTO(Pedido pedido) {
    	this.id = pedido.getId();
        this.idServico = pedido.getServico().getId();
        this.idCliente = pedido.getCliente().getId();
        this.idProfissional = pedido.getProfissional().getId();
        this.data = pedido.getData();
        this.idEndereco = pedido.getEndereco().getId();
        this.preco = pedido.getPreco();
        this.status = pedido.getStatus();
    }  	

}
