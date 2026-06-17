package com.cefet.chamapro.dto;

import com.cefet.chamapro.entity.Equipe;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class EquipeResponseDTO {
	
	private Long id;
    private String nome;
    private Long modalidadeId; 
    
    public EquipeResponseDTO(Equipe equipe) {
    	this.id = equipe.getId();
        this.nome = equipe.getNome();
        this.modalidadeId = equipe.getModalidade().getId();
    }  	

}
