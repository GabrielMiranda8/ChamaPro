package com.cefet.chamapro.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class ProfissionalRequestDTO {
    // Os dados que o Usuário envia
    @NotBlank(message = "O campo nome é obrigatório")
    private String nome;

    @NotNull(message = "O campo email é obrigatório")
    private String email;

    @NotNull(message = "O campo senha é obrigatório")
    private String senha;

}