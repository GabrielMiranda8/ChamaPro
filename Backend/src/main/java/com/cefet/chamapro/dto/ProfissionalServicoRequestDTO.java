package com.cefet.chamapro.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class ProfissionalServicoRequestDTO {
    // Os dados que o Usuário envia
    @NotNull(message = "O campo idProfissional é obrigatório")
    private String idProfissional;

    @NotNull(message = "O campo idServico é obrigatório")
    private String idServico;


    @NotNull(message = "O campo preço é obrigatório")
    private Number preco;
}