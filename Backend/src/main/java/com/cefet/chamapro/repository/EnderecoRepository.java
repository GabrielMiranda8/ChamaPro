package com.cefet.chamapro.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.cefet.chamapro.entity.Endereco;

public interface EnderecoRepository extends JpaRepository<Endereco, Long>{
	
	boolean existsByCep(String cep);
	
	boolean existsByCepAndIdNot(String cep, Long id);	
}