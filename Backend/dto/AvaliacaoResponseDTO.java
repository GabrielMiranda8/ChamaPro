package com.cefet.chamapro.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.cefet.chamapro.entity.Avaliacao;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class AvaliacaoResponseDTO {

    private String id;
    private String autorId;
    private String alvoId;
    private String pedidoId;
    private BigDecimal nota;
    private LocalDateTime data;
    private String descricao;

    public AvaliacaoResponseDTO(Avaliacao avaliacao) {
        this.id = avaliacao.getId();
        this.autorId = avaliacao.getAutor().getId();
        this.alvoId = avaliacao.getAlvo().getId();
        this.pedidoId = avaliacao.getPedido().getId();
        this.nota = avaliacao.getNota();
        this.data = avaliacao.getData();
        this.descricao = avaliacao.getDescricao();
    }

}
