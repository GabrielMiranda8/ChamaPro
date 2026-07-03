package com.cefet.chamapro.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.cefet.chamapro.entity.Caracteristica;

public interface CaracteristicaRepository extends JpaRepository<Caracteristica, String> {

	boolean existsByNome(String nome);

	boolean existsByNomeAndIdNot(String nome, String id);
}