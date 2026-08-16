package com.cefet.chamapro.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.cefet.chamapro.entity.Profissional;

public interface ProfissionalRepository extends JpaRepository<Profissional, String>{
	
	boolean existsByNome(String nome);
	
	boolean existsByNomeAndIdNot(String nome, String id);	

	List<Profissional> findByAtivoTrue();
}
