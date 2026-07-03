package com.cefet.chamapro.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Column;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "tb_caracteristica")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Caracteristica {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false, length = 200, unique = true)
    private String nome;

    @Column(nullable = false, length = 200)
    private String descricao;
}