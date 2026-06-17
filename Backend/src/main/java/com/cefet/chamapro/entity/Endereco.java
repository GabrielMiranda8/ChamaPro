package com.cefet.chamapro.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Column;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "tb_endereco")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Endereco {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private String id;

    @Column(nullable = false, length = 9, unique = true)
    private String cep;

    @Column(nullable = false, length = 100, unique = true)
    private String rua;

    @Column(nullable = false, length = 100, unique = true)
    private String bairro;

    @Column(nullable = false, length = 100, unique = true)
    private String cidade;

    @Column(nullable = false, length = 5, unique = true)
    private Number numero;

    @Column(nullable = false, length = 1, unique = true)
    private String complemento;

    @Column(nullable = false, length = 200, unique = true)
    private String referencia;

    @ManyToOne
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

}
