package com.cefet.chamapro.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.cefet.chamapro.entity.Arquivo;

public interface ArquivoRepository extends JpaRepository<Arquivo, String> {

}