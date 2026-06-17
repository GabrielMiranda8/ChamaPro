package com.cefet.chamapro.dto;

import java.util.Date;

import com.cefet.chamapro.entity.ProfissionalServico;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class ProfissionalServicoResponseDTO {
	
	private Number preco;
    private Date tempoCarreira; 
    
    public ProfissionalServicoResponseDTO(ProfissionalServico ps) {
    	this.preco = ps.getPreco();
        this.tempoCarreira = ps.getTempoCarreira();
    }  	

}
