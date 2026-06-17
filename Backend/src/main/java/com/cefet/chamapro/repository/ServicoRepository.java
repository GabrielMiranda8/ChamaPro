package com.cefet.chamapro.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.cefet.chamapro.entity.Servico;

public interface ServicoRepository extends JpaRepository<Servico, Long>{
	
	boolean existsByNome(String nome);
	
	boolean existsByNomeAndIdNot(String nome, Long id);	
}
