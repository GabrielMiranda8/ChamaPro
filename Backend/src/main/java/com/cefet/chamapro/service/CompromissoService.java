package com.cefet.chamapro.service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.cefet.chamapro.dto.CompromissoResponseDTO;
import com.cefet.chamapro.entity.Compromisso;
import com.cefet.chamapro.entity.Pedido;
import com.cefet.chamapro.exception.BusinessException;
import com.cefet.chamapro.exception.ResourceNotFoundException;
import com.cefet.chamapro.repository.CompromissoRepository;
import com.cefet.chamapro.repository.ProfissionalRepository;

@Service
public class CompromissoService {

    @Autowired
    private CompromissoRepository cRepository;

    @Autowired
    private ProfissionalRepository profissionalRepository;

    @Transactional(readOnly = true)
    public List<CompromissoResponseDTO> listarPorProfissionalEData(String idProfissional, LocalDate data) {
        if (!profissionalRepository.existsById(idProfissional)) {
            throw new ResourceNotFoundException("Profissional não encontrado. Id: " + idProfissional);
        }

        List<Compromisso> compromissos = cRepository.findByProfissional_IdAndDataAndAtivoTrue(idProfissional, data);

        List<CompromissoResponseDTO> lista = new ArrayList<>();
        for (int i = 0; i < compromissos.size(); i++) {
            lista.add(new CompromissoResponseDTO(compromissos.get(i)));
        }
        return lista;
    }

    // Usada pela página de Agenda do profissional: todos os compromissos
    // ativos de hoje em diante, já ordenados por data e hora.
    @Transactional(readOnly = true)
    public List<CompromissoResponseDTO> listarAgendaDoProfissional(String idProfissional) {
        if (!profissionalRepository.existsById(idProfissional)) {
            throw new ResourceNotFoundException("Profissional não encontrado. Id: " + idProfissional);
        }

        List<Compromisso> compromissos = cRepository
                .findByProfissional_IdAndAtivoTrueOrderByDataAscHoraInicioAsc(idProfissional);

        List<CompromissoResponseDTO> lista = new ArrayList<>();
        for (int i = 0; i < compromissos.size(); i++) {
            lista.add(new CompromissoResponseDTO(compromissos.get(i)));
        }
        return lista;
    }

    // Chamado pelo PedidoService ao aceitar um pedido. Recebe o Pedido já
    // carregado (pra não precisar buscar de novo) e os dados do horário.
    @Transactional
    public CompromissoResponseDTO inserir(Pedido pedido, LocalDate dataInicio, LocalDate dataFim, LocalTime horaInicio, LocalTime horaFim) {

        if (!horaFim.isAfter(horaInicio)) {
            throw new BusinessException("O horário de término deve ser depois do horário de início.");
        }

        if (!dataFim.isAfter(dataInicio) && !dataFim.isEqual(dataInicio)) {
            throw new BusinessException("A data de término deve ser depois da data de início.");
        }

        if (horaInicio.getMinute() != 0 && horaInicio.getMinute() != 30) {
            throw new BusinessException("O horário de início deve ser de 30 em 30 minutos.");
        }

        if (horaFim.getMinute() != 0 && horaFim.getMinute() != 30) {
            throw new BusinessException("O horário de término deve ser de 30 em 30 minutos.");
        }

        List<Compromisso> conflitos = cRepository.buscarConflitos(
                pedido.getProfissional().getId(), dataInicio, dataFim, horaInicio, horaFim);

        if (!conflitos.isEmpty()) {
            throw new BusinessException("Você já tem um compromisso marcado nesse horário.");
        }

        Compromisso c = new Compromisso();
        c.setProfissional(pedido.getProfissional());
        c.setPedido(pedido);
        c.setDataInicio(dataInicio);
        c.setDataFim(dataFim);
        c.setHoraInicio(horaInicio);
        c.setHoraFim(horaFim);
        c.setAtivo(true);

        return new CompromissoResponseDTO(cRepository.save(c));
    }

    // Chamado pelo PedidoService quando o pedido é recusado ou cancelado.
    // Segue o mesmo padrão de soft-delete usado pra Usuario: não apaga a
    // linha, só marca como inativo, liberando o horário mas mantendo o histórico.
    @Transactional
    public void desativarPorPedido(String idPedido) {
        Optional<Compromisso> compromisso = cRepository.findByPedido_Id(idPedido);

        if (compromisso.isPresent()) {
            Compromisso c = compromisso.get();
            c.setAtivo(false);
            cRepository.save(c);
        }
    }
}