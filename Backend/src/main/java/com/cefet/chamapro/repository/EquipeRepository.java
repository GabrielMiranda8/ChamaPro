package com.cefet.chamapro.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.cefet.chamapro.entity.Equipe;

public interface EquipeRepository extends JpaRepository<Equipe, Long>{
	
	boolean existsByNome(String nome);
	
	boolean existsByNomeAndIdNot(String nome, Long id);	
}