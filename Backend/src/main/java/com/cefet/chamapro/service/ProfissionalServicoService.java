package com.cefet.chamapro.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.cefet.chamapro.dto.ProfissionalServicoRequestDTO;
import com.cefet.chamapro.dto.ProfissionalServicoResponseDTO;
import com.cefet.chamapro.entity.ProfissionalServico;
import com.cefet.chamapro.exception.BusinessException;
import com.cefet.chamapro.exception.ResourceNotFoundException;
import com.cefet.chamapro.repository.ProfissionalServicoRepository;


public class ProfissionalServicoService {
    @Autowired
    private ProfissionalServicoRepository psRepository;
    


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

    	if (psRepository.existsById(dto.getIdProfissional()) && psRepository.existsById(dto.getIdServico())){
            throw new BusinessException("Já existe um profissional com esse serviço.");
        }

        
    	ProfissionalServico ps = new ProfissionalServico();
    	ps.setPreco(dto.getPreco());
        ps.setIdProfissional(dto.getIdProfissional());
        ps.setIdServico(dto.getIdProfissional());

        return new ProfissionalServicoResponseDTO(psRepository.save(ps));
    }
    
    @Transactional
    public ProfissionalServicoResponseDTO atualizar(String id, ProfissionalServicoRequestDTO dto) {

    	ProfissionalServico ps = psRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("ProfissionalServico não encontrado. Id: " + id));

    	
    	ps.setPreco(dto.getPreco());

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
