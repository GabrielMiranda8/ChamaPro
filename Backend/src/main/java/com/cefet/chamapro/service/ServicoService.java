package com.cefet.chamapro.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.cefet.chamapro.dto.ServicoRequestDTO;
import com.cefet.chamapro.dto.ServicoResponseDTO;
import com.cefet.chamapro.entity.Servico;
import com.cefet.chamapro.exception.BusinessException;
import com.cefet.chamapro.exception.ResourceNotFoundException;
import com.cefet.chamapro.repository.ServicoRepository;


@Service
public class ServicoService {
    @Autowired
    private ServicoRepository servicoRepository;

    @Transactional(readOnly = true)
    public List<ServicoResponseDTO> listar() {
        List<Servico> servicos = servicoRepository.findAll();
        return servicos.stream().map(ServicoResponseDTO::new).toList();
    }

    @Transactional(readOnly = true)
    public ServicoResponseDTO buscarPorId(String id) {
    	Servico servico = servicoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Servico não encontrado. Id: " + id));

        return new ServicoResponseDTO(servico);
    }

    @Transactional
    public ServicoResponseDTO inserir(ServicoRequestDTO dto) {

    	if (servicoRepository.existsByNome(dto.getNome())){
            throw new BusinessException("Já existe uma servico com esse nome.");
        }

        
    	Servico servico = new Servico();
    	servico.setNome(dto.getNome());
        servico.setDescricao(dto.getDescricao());

        return new ServicoResponseDTO(servicoRepository.save(servico));
    }
    
    @Transactional
    public ServicoResponseDTO atualizar(String id, ServicoRequestDTO dto) {

    	Servico servico = servicoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Servico não encontrado. Id: " + id));

    	if (servicoRepository.existsByNomeAndIdNot(dto.getNome(), id)) {
            throw new BusinessException("Já existe um servico com esse nome.");
        }
    	
    	servico.setNome(dto.getNome());
        servico.setDescricao(dto.getDescricao());

        return new ServicoResponseDTO(servicoRepository.save(servico));
    }    

    @Transactional
    public void excluir(String id) {
        if (!servicoRepository.existsById(id)) {
            throw new ResourceNotFoundException("Servico não encontrado com ID: " + id);
        }
        servicoRepository.deleteById(id);
    }
}
