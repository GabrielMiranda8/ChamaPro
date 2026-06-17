package com.cefet.chamapro.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.cefet.chamapro.entity.Profissional;

public interface ProfissionalRepository extends JpaRepository<Profissional, Long>{
	
	boolean existsByNome(String nome);
	
	boolean existsByNomeAndIdNot(String nome, Long id);	
}
