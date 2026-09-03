package com.cefet.chamapro.repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.cefet.chamapro.entity.Compromisso;

public interface CompromissoRepository extends JpaRepository<Compromisso, String> {

        List<Compromisso> findByProfissional_IdAndDataInicioAndAtivoTrue(String profissionalId, LocalDate data);

        List<Compromisso> findByProfissional_IdAndAtivoTrueOrderByDataInicioAscHoraInicioAsc(String profissionalId);

        Optional<Compromisso> findByPedido_Id(String pedidoId);

        // Dois intervalos [inicioA, fimA) e [inicioB, fimB) se cruzam quando
        // inicioA < fimB E inicioB < fimA. É a checagem clássica de sobreposição.
        @Query("""
                            SELECT c FROM Compromisso c
                            WHERE c.profissional.id = :profissionalId
                              AND c.ativo = true
                              AND c.dataInicio <= :dataFim
                              AND c.dataFim >= :dataInicio
                              AND c.horaInicio < :horaFim
                              AND :horaInicio < c.horaFim
                        """)
        List<Compromisso> buscarConflitos(String profissionalId, LocalDate dataInicio, LocalDate dataFim,
                        LocalTime horaInicio, LocalTime horaFim);

        List<Compromisso> findByProfissional_IdAndAtivoTrueAndDataInicioGreaterThanEqualOrderByDataInicioAscHoraInicioAsc(
                        String profissionalId, LocalDate data);
}