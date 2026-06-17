package com.cefet.chamapro.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.cefet.chamapro.dto.EnderecoRequestDTO;
import com.cefet.chamapro.dto.EnderecoResponseDTO;
import com.cefet.chamapro.entity.Endereco;
import com.cefet.chamapro.exception.BusinessException;
import com.cefet.chamapro.exception.ResourceNotFoundException;
import com.cefet.chamapro.repository.EnderecoRepository;


public class EnderecoService {
    @Autowired
    private EnderecoRepository enderecoRepository;
    


    @Transactional(readOnly = true)
    public List<EnderecoResponseDTO> listar() {
        List<Endereco> enderecos = enderecoRepository.findAll();
        return enderecos.stream().map(EnderecoResponseDTO::new).toList();
    }

    @Transactional(readOnly = true)
    public EnderecoResponseDTO buscarPorId(Long id) {
    	Endereco endereco = enderecoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Endereco não encontrado. Id: " + id));

        return new EnderecoResponseDTO(endereco);
    }

    @Transactional
    public EnderecoResponseDTO inserir(EnderecoRequestDTO dto) {

    	if (enderecoRepository.existsByCep(dto.getCep())){
            throw new BusinessException("Já existe uma endereco com esse nome.");
        }

        
    	Endereco endereco = new Endereco();
    	endereco.setCep(dto.getCep());

        return new EnderecoResponseDTO(enderecoRepository.save(endereco));
    }
    
    @Transactional
    public EnderecoResponseDTO atualizar(Long id, EnderecoRequestDTO dto) {

    	Endereco endereco = enderecoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Endereco não encontrado. Id: " + id));

    	if (enderecoRepository.existsByCepAndIdNot(dto.getCep(), id)) {
            throw new BusinessException("Já existe uma endereco com esse nome.");
        }
    	
    	endereco.setCep(dto.getCep());

        return new EnderecoResponseDTO(enderecoRepository.save(endereco));
    }    

    @Transactional
    public void excluir(Long id) {
        if (!enderecoRepository.existsById(id)) {
            throw new ResourceNotFoundException("Endereco não encontrado com ID: " + id);
        }
        enderecoRepository.deleteById(id);
    }
}
