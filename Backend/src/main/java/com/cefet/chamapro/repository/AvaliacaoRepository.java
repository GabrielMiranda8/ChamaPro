package com.cefet.chamapro.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.cefet.chamapro.entity.Avaliacao;

public interface AvaliacaoRepository extends JpaRepository<Avaliacao, String> {

    boolean existsByAutor_IdAndAlvo_Id(String autorId, String alvoId);

    boolean existsByAutor_IdAndAlvo_IdAndIdNot(String autorId, String alvoId, String id);

    boolean existsByAutor_IdAndAlvo_IdAndPedido_Id(String autorId, String alvoId, String pedidoId);

    List<Avaliacao> findByAlvo_Id(String alvoId);

    List<Avaliacao> findByAutor_Id(String autorId);

    Optional<Avaliacao> findByAlvo_IdAndAutor_Id(String alvoId, String autorId);
}