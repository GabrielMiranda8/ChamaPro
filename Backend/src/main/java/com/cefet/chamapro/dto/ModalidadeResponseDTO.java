package com.cefet.chamapro.dto;

import com.cefet.chamapro.entity.Modalidade;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class ModalidadeResponseDTO {
	
	private Long id;
    private String descricao;
    
    public ModalidadeResponseDTO(Modalidade modalidade) {
    	this.id = modalidade.getId();
        this.descricao = modalidade.getDescricao();
    }  	

}
