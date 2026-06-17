package com.cefet.chamapro.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class EquipeRequestDTO {

    @NotBlank(message = "O campo nome é obrigatório")
    private String nome;
    
    @NotNull(message = "O campo modalidadeId é obrigatório")
    private Long modalidadeId;    

}