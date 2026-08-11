package com.cefet.chamapro.dto;

import java.math.BigDecimal;
import java.util.Date;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class PedidoRequestDTO {

    @NotBlank(message = "O campo preco é obrigatório")
    private BigDecimal preco;

    @NotBlank(message = "O campo idServico é obrigatório")
    private String idServico;

    @NotBlank(message = "O campo idCliente é obrigatório")
    private String idCliente;

    @NotBlank(message = "O campo idProfissional é obrigatório")
    private String idProfissional;

    @NotNull(message = "O campo data é obrigatório")
    private Date data;

    @NotBlank(message = "O campo idEndereco é obrigatório")
    private String idEndereco;

}