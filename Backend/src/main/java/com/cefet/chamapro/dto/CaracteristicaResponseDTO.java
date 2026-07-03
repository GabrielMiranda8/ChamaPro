package com.cefet.chamapro.dto;

import com.cefet.chamapro.entity.Caracteristica;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class CaracteristicaResponseDTO {

	private String id;
    private String nome;
    private String descricao;

    public CaracteristicaResponseDTO(Caracteristica caracteristica) {
    	this.id = caracteristica.getId();
        this.nome = caracteristica.getNome();
        this.descricao = caracteristica.getDescricao();
    }

}