package com.cefet.chamapro.repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.cefet.chamapro.entity.Compromisso;

public interface CompromissoRepository extends JpaRepository<Compromisso, String> {

    List<Compromisso> findByProfissional_IdAndDataInicioAndAtivoTrue(String profissionalId, LocalDate data);
    List<Compromisso> findByProfissional_IdAndAtivoTrueOrderByDataInicioAscHoraInicioAsc(String profissionalId);

    Optional<Compromisso> findByPedido_Id(String pedidoId);

    // Dois intervalos de datas [dataInicio, dataFim] se cruzam quando
    // dataInicioA <= dataFimB E dataInicioB <= dataFimA.
    // Dentro do(s) dia(s) que se cruzam, também precisa haver sobreposição de horário.
    @Query("""
                SELECT c FROM Compromisso c
                WHERE c.profissional.id = :profissionalId
                  AND c.ativo = true
                  AND c.dataInicio <= :dataFim
                  AND :dataInicio <= c.dataFim
                  AND c.horaInicio < :horaFim
                  AND :horaInicio < c.horaFim
            """)
    List<Compromisso> buscarConflitos(
            @Param("profissionalId") String profissionalId,
            @Param("dataInicio") LocalDate dataInicio,
            @Param("dataFim") LocalDate dataFim,
            @Param("horaInicio") LocalTime horaInicio,
            @Param("horaFim") LocalTime horaFim);

    List<Compromisso> findByProfissional_IdAndAtivoTrueAndDataInicioGreaterThanEqualOrderByDataInicioAscHoraInicioAsc(
            String profissionalId, LocalDate data);
}