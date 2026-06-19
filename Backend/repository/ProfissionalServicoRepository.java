package com.cefet.chamapro.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.cefet.chamapro.entity.ProfissionalServico;

public interface ProfissionalServicoRepository extends JpaRepository<ProfissionalServico, String> {

    boolean existsByServico_IdAndProfissional_Id(String servicoId, String profissionalId);

    boolean existsByServico_IdAndProfissional_IdAndIdNot(String servicoId, String profissionalId, String id);
}