package com.cefet.intercards.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.cefet.intercards.entity.Equipe;

public interface EquipeRepository extends JpaRepository<Equipe, Long>{
	
	boolean existsByNome(String nome);
	
	boolean existsByNomeAndIdNot(String nome, Long id);	
}