package com.cefet.chamapro.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.cefet.chamapro.entity.CaracteristicaUsuario;

public interface CaracteristicaUsuarioRepository extends JpaRepository<CaracteristicaUsuario, String> {

    boolean existsByUsuario_IdAndCaracteristica_Id(String usuarioId, String caracteristicaId);

    boolean existsByUsuario_IdAndCaracteristica_IdAndIdNot(String usuarioId, String caracteristicaId, String id);

    List<CaracteristicaUsuario> findByCaracteristica_Id(String caracteristicaId);

    List<CaracteristicaUsuario> findByUsuario_Id(String usuarioId);

    Optional<CaracteristicaUsuario> findByCaracteristica_IdAndUsuario_Id(String caracteristicaId, String usuarioId);
}