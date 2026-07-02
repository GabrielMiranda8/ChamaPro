package com.cefet.chamapro.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.cefet.chamapro.entity.ProfissionalServico;

public interface ProfissionalServicoRepository extends JpaRepository<ProfissionalServico, String> {

    boolean existsByServico_IdAndProfissional_Id(String servicoId, String profissionalId);

    boolean existsByServico_IdAndProfissional_IdAndIdNot(String servicoId, String profissionalId, String id);

    List<ProfissionalServico> findByProfissional_Id(String profissionalId);

    List<ProfissionalServico> findByServico_Id(String servicoId);

    Optional<ProfissionalServico> findByProfissional_IdAndServico_Id(String profissionalId, String servicoId);
}
