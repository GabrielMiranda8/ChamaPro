package com.cefet.intercards.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.cefet.intercards.dto.ModalidadeRequestDTO;
import com.cefet.intercards.dto.ModalidadeResponseDTO;
import com.cefet.intercards.entity.Modalidade;
import com.cefet.intercards.exception.BusinessException;
import com.cefet.intercards.exception.ResourceNotFoundException;
import com.cefet.intercards.repository.ModalidadeRepository;

@Service
public class ModalidadeService {

    @Autowired
    private ModalidadeRepository modalidadeRepository;

    @Transactional(readOnly = true)
    public List<ModalidadeResponseDTO> listar() {
        List<Modalidade> modalidades = modalidadeRepository.findAll();
        return modalidades.stream().map(ModalidadeResponseDTO::new).toList();
    }

    @Transactional(readOnly = true)
    public ModalidadeResponseDTO buscarPorId(Long id) {
    	Modalidade modalidade = modalidadeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Modalidade não encontrado. Id: " + id));

        return new ModalidadeResponseDTO(modalidade);
    }

    @Transactional
    public ModalidadeResponseDTO inserir(ModalidadeRequestDTO dto) {

    	if (modalidadeRepository.existsByDescricao(dto.getDescricao())) {
            throw new BusinessException("Já existe uma modalidade com essa descrição.");
        }
    	
    	Modalidade modalidade = new Modalidade();
    	modalidade.setDescricao(dto.getDescricao());

        return new ModalidadeResponseDTO(modalidadeRepository.save(modalidade));
    }
    
    @Transactional
    public ModalidadeResponseDTO atualizar(Long id, ModalidadeRequestDTO dto) {

    	Modalidade modalidade = modalidadeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Modalidade não encontrado. Id: " + id));

    	if (modalidadeRepository.existsByDescricaoAndIdNot(dto.getDescricao(), id)) {
    		throw new BusinessException("Já existe uma modalidade com essa descrição.");
        }    	
    	
    	modalidade.setDescricao(dto.getDescricao());

        return new ModalidadeResponseDTO(modalidadeRepository.save(modalidade));
    }    

    @Transactional
    public void excluir(Long id) {
        if (!modalidadeRepository.existsById(id)) {
            throw new ResourceNotFoundException("Modalidade não encontrado com ID: " + id);
        }

        modalidadeRepository.deleteById(id);
    }
}