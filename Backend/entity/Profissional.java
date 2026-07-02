package com.cefet.chamapro.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "tb_profissional")
@Getter
@Setter
@NoArgsConstructor
public class Profissional extends Cliente {
}