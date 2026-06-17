package com.cefet.chamapro.dto;

import com.cefet.chamapro.entity.Endereco;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class EnderecoResponseDTO {
	
	private String cep;
    private String bairro;
    private String rua;
    private Number numero;
    private String complemento; 
    
    public EnderecoResponseDTO(Endereco endereco) {
    	this.cep = endereco.getId();
        this.rua = endereco.getRua();
        this.bairro = endereco.getBairro();
        this.numero = endereco.getNumero();
        this.complemento = endereco.getComplemento();
    }  	

}
