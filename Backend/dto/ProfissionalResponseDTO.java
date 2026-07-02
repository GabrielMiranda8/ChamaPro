package com.cefet.chamapro.dto;

import java.util.Date;

import com.cefet.chamapro.entity.Profissional;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class ProfissionalResponseDTO {
	// Só os dados nao sensiveis
    private String id;
    private String nome;
    private Date dtNasc;
    private Date dtConta;
    private Number nota;
    private String tipo;
    
    public ProfissionalResponseDTO(Profissional profissional) {
    	this.id = profissional.getId();
        this.nome = profissional.getNome();
        this.dtNasc = profissional.getDtNasc();
        this.dtConta = profissional.getDtConta();
        this.nota = profissional.getNota();
        this.tipo = profissional.getTipo();
    }  	

}
