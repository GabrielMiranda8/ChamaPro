package com.cefet.intercards.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.cefet.intercards.entity.Modalidade;

public interface ModalidadeRepository extends JpaRepository<Modalidade, Long>{
	
	boolean existsByDescricao(String descricao);
	
	boolean existsByDescricaoAndIdNot(String descricao, Long id);
}