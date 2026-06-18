package com.cefet.chamapro.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.cefet.chamapro.dto.ProfissionalRequestDTO;
import com.cefet.chamapro.dto.ProfissionalResponseDTO;
import com.cefet.chamapro.entity.Profissional;
import com.cefet.chamapro.exception.BusinessException;
import com.cefet.chamapro.exception.ResourceNotFoundException;
import com.cefet.chamapro.repository.ProfissionalRepository;

@Service
public class ProfissionalService {
    @Autowired
    private ProfissionalRepository profissionalRepository;
    


    @Transactional(readOnly = true)
    public List<ProfissionalResponseDTO> listar() {
        List<Profissional> profissionals = profissionalRepository.findAll();
        return profissionals.stream().map(ProfissionalResponseDTO::new).toList();
    }

    @Transactional(readOnly = true)
    public ProfissionalResponseDTO buscarPorId(String id) {
    	Profissional profissional = profissionalRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Profissional não encontrado. Id: " + id));

        return new ProfissionalResponseDTO(profissional);
    }

    @Transactional
    public ProfissionalResponseDTO inserir(ProfissionalRequestDTO dto) {

    	if (profissionalRepository.existsByNome(dto.getNome())){
            throw new BusinessException("Já existe uma profissional com esse nome.");
        }

        
    	Profissional profissional = new Profissional();
    	profissional.setNome(dto.getNome());

        return new ProfissionalResponseDTO(profissionalRepository.save(profissional));
    }
    
    @Transactional
    public ProfissionalResponseDTO atualizar(String id, ProfissionalRequestDTO dto) {

    	Profissional profissional = profissionalRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Profissional não encontrado. Id: " + id));

    	if (profissionalRepository.existsByNomeAndIdNot(dto.getNome(), id)) {
            throw new BusinessException("Já existe uma profissional com esse nome.");
        }
    	
    	profissional.setNome(dto.getNome());

        return new ProfissionalResponseDTO(profissionalRepository.save(profissional));
    }    

    @Transactional
    public void excluir(String id) {
        if (!profissionalRepository.existsById(id)) {
            throw new ResourceNotFoundException("Profissional não encontrado com ID: " + id);
        }
        profissionalRepository.deleteById(id);
    }
}
