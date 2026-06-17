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
@Table(name = "tb_usuario")
@Inheritance(strategy = InheritanceType.JOINED)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Usuario {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 200, unique = true)
    private String nome;

    @Column(nullable = false, length = 200, unique = true)
    private String email;

    @Column(nullable = false, length = 200)
    private String senha;

    @Column(nullable = false, length = 200, unique = true)
    private String cpf;

    @Column(nullable = false, length = 200)
    private String dtNasc;

    @Column(nullable = false, length = 200)
    private String dtConta;

    @Column(nullable = false)
    private Number nota;

    @Column(nullable = false, length = 200)
    private String tipo;
}