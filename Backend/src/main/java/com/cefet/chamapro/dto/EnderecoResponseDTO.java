package com.cefet.chamapro.dto;

import com.cefet.chamapro.entity.Endereco;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class EnderecoResponseDTO {

    private String id;
    private String cep;
    private String bairro;
    private String rua;
    private Integer numero;
    private String complemento;
    private String cidade;
    private String referencia;

    public EnderecoResponseDTO(Endereco endereco) {
        this.id = endereco.getId();
        this.cep = endereco.getCep();
        this.rua = endereco.getRua();
        this.bairro = endereco.getBairro();
        this.numero = endereco.getNumero();
        this.complemento = endereco.getComplemento();
        this.cidade = endereco.getCidade();
        this.referencia = endereco.getReferencia();
    }

}
