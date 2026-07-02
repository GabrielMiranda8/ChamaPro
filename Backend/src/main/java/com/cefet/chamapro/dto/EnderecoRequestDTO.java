package com.cefet.chamapro.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
@Setter
@Getter
@NoArgsConstructor
public class EnderecoRequestDTO {

    //@NotBlank(message = "O campo cep é obrigatório")
    private String cep;

    //@NotBlank(message = "O campo rua é obrigatório")
    private String rua;

    //@NotBlank(message = "O campo bairro é obrigatório")
    private String bairro;
    
    //@NotBlank(message = "O campo cidade é obrigatório")
    private String cidade;

    //@NotNull(message = "O campo numero é obrigatório")
    private Integer numero;

    private String complemento;
    private String referencia;
    
    private String idUsuario;
}