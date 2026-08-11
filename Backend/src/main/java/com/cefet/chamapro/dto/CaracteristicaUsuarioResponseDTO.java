package com.cefet.chamapro.dto;

import com.cefet.chamapro.entity.CaracteristicaUsuario;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class CaracteristicaUsuarioResponseDTO {
	
	private String id;
    private String usuarioId;
    private String usuarioNome;
    private String caracteristicaId;
    private String caracteristicaNome;
    private boolean tem;
    private boolean lida;

    public CaracteristicaUsuarioResponseDTO(CaracteristicaUsuario cu) {
        this.id = cu.getId();
        this.usuarioId = cu.getUsuario().getId();
        this.usuarioNome = cu.getUsuario().getNome();
        this.caracteristicaId = cu.getCaracteristica().getId();
        this.caracteristicaNome = cu.getCaracteristica().getNome();
        this.tem = cu.isTem();
        this.lida = cu.isLida();
    }
}  	


