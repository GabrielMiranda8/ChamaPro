package com.cefet.chamapro.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.cefet.chamapro.entity.Pedido;

public interface PedidoRepository extends JpaRepository<Pedido, String> {

    boolean existsByCliente_IdAndProfissional_Id(String clienteId, String profissionalId);

    boolean existsByCliente_IdAndProfissional_IdAndIdNot(String clienteId, String profissionalId, String id);

    List<Pedido> findByProfissional_Id(String profissionalId);

    List<Pedido> findByCliente_Id(String clienteId);

    List<Pedido> findByServico_Id(String idServico);

    Optional<Pedido> findByProfissional_IdAndCliente_Id(String profissionalId, String clienteId);

    
}