package com.cefet.chamapro.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.cefet.chamapro.dto.ProfissionalServicoRequestDTO;
import com.cefet.chamapro.dto.ProfissionalServicoResponseDTO;
import com.cefet.chamapro.entity.Profissional;
import com.cefet.chamapro.entity.ProfissionalServico;
import com.cefet.chamapro.entity.Servico;
import com.cefet.chamapro.exception.BusinessException;
import com.cefet.chamapro.exception.ResourceNotFoundException;
import com.cefet.chamapro.repository.ProfissionalRepository;
import com.cefet.chamapro.repository.ProfissionalServicoRepository;
import com.cefet.chamapro.repository.ServicoRepository;

@Service
public class ProfissionalServicoService {

    @Autowired
    private ProfissionalServicoRepository psRepository;

    @Autowired
    private ProfissionalRepository profissionalRepository;

    @Autowired
    private ServicoRepository servicoRepository;

    @Transactional(readOnly = true)
    public List<ProfissionalServicoResponseDTO> listar() {
        List<ProfissionalServico> pss = psRepository.findAll();
        return pss.stream().map(ProfissionalServicoResponseDTO::new).toList();
    }

    @Transactional(readOnly = true)
    public ProfissionalServicoResponseDTO buscarPorId(String id) {
        ProfissionalServico ps = psRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("ProfissionalServico não encontrado. Id: " + id));
        return new ProfissionalServicoResponseDTO(ps);
    }

    @Transactional
    public ProfissionalServicoResponseDTO inserir(ProfissionalServicoRequestDTO dto) {

        if (psRepository.existsByServico_IdAndProfissional_Id(dto.getIdServico(), dto.getIdProfissional())) {
            throw new BusinessException("Esse profissional já oferece esse serviço.");
        }

        Profissional profissional = profissionalRepository.findById(dto.getIdProfissional())
                .orElseThrow(() -> new ResourceNotFoundException("Profissional não encontrado. Id: " + dto.getIdProfissional()));

        Servico servico = servicoRepository.findById(dto.getIdServico())
                .orElseThrow(() -> new ResourceNotFoundException("Serviço não encontrado. Id: " + dto.getIdServico()));

        ProfissionalServico ps = new ProfissionalServico();
        ps.setProfissional(profissional);
        ps.setServico(servico);
        ps.setPreco(dto.getPreco());
        ps.setTempoCarreira(dto.getTempoCarreira());

        return new ProfissionalServicoResponseDTO(psRepository.save(ps));
    }

    @Transactional
    public ProfissionalServicoResponseDTO atualizar(String id, ProfissionalServicoRequestDTO dto) {
        ProfissionalServico ps = psRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("ProfissionalServico não encontrado. Id: " + id));

        ps.setPreco(dto.getPreco());
        ps.setTempoCarreira(dto.getTempoCarreira());
        // profissional/servico não mudam num update — se quiser permitir troca, me avisa

        return new ProfissionalServicoResponseDTO(psRepository.save(ps));
    }

    @Transactional
    public void excluir(String id) {
        if (!psRepository.existsById(id)) {
            throw new ResourceNotFoundException("ProfissionalServico não encontrado com ID: " + id);
        }
        psRepository.deleteById(id);
    }
}