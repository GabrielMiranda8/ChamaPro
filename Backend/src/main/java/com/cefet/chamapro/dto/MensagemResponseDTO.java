package com.cefet.chamapro.dto;

import java.time.LocalDateTime;

import com.cefet.chamapro.entity.Mensagem;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class MensagemResponseDTO {

    private String id;
    private String idPedido;
    private String idRemetente;
    private String nomeRemetente;
    private String texto;
    private LocalDateTime data;
    private boolean lida;

    public MensagemResponseDTO(Mensagem mensagem) {
        this.id = mensagem.getId();
        this.idPedido = mensagem.getPedido().getId();
        this.idRemetente = mensagem.getRemetente().getId();
        this.nomeRemetente = mensagem.getRemetente().getNome();
        this.texto = mensagem.getTexto();
        this.data = mensagem.getData();
        this.lida = mensagem.isLida();
    }
}