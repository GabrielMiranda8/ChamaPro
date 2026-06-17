package com.cefet.chamapro.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.util.Date;

import jakarta.persistence.Column;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "tb_profissionalServico")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ProfissionalServico {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private String id;

    @Column(nullable = false, length = 200, unique = true)
    private String idServico;

    @Column(nullable = false, length = 200, unique = true)
    private String idProfissional;

    @Column(nullable = false, length = 200, unique = true)
    private Number preco;

    @Column(nullable = false, length = 200, unique = true)
    private Date tempoCarreira;
    // id: string;
    // idServico: string;
    // idProfissional: string;
    // preco: number;
    // tempoCarreira: Date;
}
