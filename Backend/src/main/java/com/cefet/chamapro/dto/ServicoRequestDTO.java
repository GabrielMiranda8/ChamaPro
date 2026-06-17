package com.cefet.chamapro.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class ServicoRequestDTO {

    @NotBlank(message = "O campo nome é obrigatório")
    private String nome;
    
    @NotNull(message = "O campo descrição é obrigatório")
    private String descricao;    

}