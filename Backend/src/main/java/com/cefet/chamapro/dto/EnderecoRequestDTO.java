package com.cefet.chamapro.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class EnderecoRequestDTO {

    @NotBlank(message = "O campo cep é obrigatório")
    private String cep;

    @NotBlank(message = "O campo cep é obrigatório")
    private String rua;

    @NotBlank(message = "O campo cep é obrigatório")
    private String bairro;
    
    @NotBlank(message = "O campo cep é obrigatório")
    private String cidade;

    @NotBlank(message = "O campo cep é obrigatório")
    private Number numero;

    @NotBlank(message = "O campo cep é obrigatório")
    private String complemento;

    @NotBlank(message = "O campo cep é obrigatório")
    private String referencia;
  
}