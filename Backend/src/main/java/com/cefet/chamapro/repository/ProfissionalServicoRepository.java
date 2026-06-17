package com.cefet.chamapro.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.cefet.chamapro.entity.ProfissionalServico;

public interface ProfissionalServicoRepository extends JpaRepository<ProfissionalServico, String>{
	
	boolean existsByNome(String nome);
	
	boolean existsByNomeAndIdNot(String nome, String id);	
}
