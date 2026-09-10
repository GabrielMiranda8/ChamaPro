package com.cefet.chamapro.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.cefet.chamapro.entity.Mensagem;

public interface MensagemRepository extends JpaRepository<Mensagem, String> {

    List<Mensagem> findByPedido_IdOrderByDataAsc(String idPedido);

    List<Mensagem> findByPedido_IdAndLidaFalseAndRemetente_IdNot(String idPedido, String idUsuarioLogado);
}