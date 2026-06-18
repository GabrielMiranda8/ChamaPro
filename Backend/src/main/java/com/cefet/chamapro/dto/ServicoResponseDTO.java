package com.cefet.chamapro.dto;

import com.cefet.chamapro.entity.Servico;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class ServicoResponseDTO {
	
	private String id;
    private String nome;
    private String descricao; 
    
    public ServicoResponseDTO(Servico servico) {
    	this.id = servico.getId();
        this.nome = servico.getNome();
        this.descricao = servico.getDescricao();
    }  	

}
