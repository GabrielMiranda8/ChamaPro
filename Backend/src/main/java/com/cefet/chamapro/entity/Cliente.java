package com.cefet.chamapro.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "tb_cliente")
@Getter
@Setter
//@NoArgsConstructor
//@AllArgsConstructor
public class Cliente extends Usuario {
}