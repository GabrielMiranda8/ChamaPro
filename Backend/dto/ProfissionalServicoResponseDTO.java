package com.cefet.chamapro.dto;

import java.math.BigDecimal;
import java.util.Date;

import com.cefet.chamapro.entity.ProfissionalServico;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class ProfissionalServicoResponseDTO {
	
	    private String id;
    private String servicoId;
    private String servicoNome;
    private String profissionalId;
    private String profissionalNome;
    private BigDecimal preco;
    private Date tempoCarreira;

    public ProfissionalServicoResponseDTO(ProfissionalServico ps) {
        this.id = ps.getId();
        this.servicoId = ps.getServico().getId();
        this.servicoNome = ps.getServico().getNome();
        this.profissionalId = ps.getProfissional().getId();
        this.profissionalNome = ps.getProfissional().getNome();
        this.preco = ps.getPreco();
        this.tempoCarreira = ps.getTempoCarreira();
    }
}  	


