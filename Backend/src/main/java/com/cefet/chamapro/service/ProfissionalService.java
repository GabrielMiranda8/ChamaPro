package com.cefet.chamapro.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.cefet.chamapro.dto.ProfissionalRequestDTO;
import com.cefet.chamapro.dto.ProfissionalResponseDTO;
import com.cefet.chamapro.dto.ServicoResponseDTO;
import com.cefet.chamapro.dto.ProfissionalRequestDTO;
import com.cefet.chamapro.dto.ProfissionalResponseDTO;
import com.cefet.chamapro.entity.Profissional;
import com.cefet.chamapro.entity.Profissional;
import com.cefet.chamapro.entity.Usuario;
import com.cefet.chamapro.exception.BusinessException;
import com.cefet.chamapro.exception.ResourceNotFoundException;
import com.cefet.chamapro.repository.ProfissionalRepository;
import com.cefet.chamapro.repository.UsuarioRepository;

import jakarta.persistence.EntityNotFoundException;

@Service
public class ProfissionalService {
    @Autowired
    private ProfissionalRepository profissionalRepository;
    @Autowired
    private UsuarioRepository usuarioRepository;


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
        // se já existe, retorna o registro existente (evita erro de chave primária)
        if (profissionalRepository.existsById(dto.id())) {
            return new ProfissionalResponseDTO(profissionalRepository.findById(dto.id()).get());
        }

        Usuario usuario = usuarioRepository.findById(dto.id())
                .orElseThrow(() -> new EntityNotFoundException("Usuário não encontrado"));

        Profissional profissional = new Profissional();
        profissional.setId(usuario.getId()); // mesmo ID
        profissional.setNome(usuario.getNome());
        profissional.setEmail(usuario.getEmail());
        profissional.setSenha(usuario.getSenha());
        profissional.setCpf(usuario.getCpf());
        profissional.setDtNasc(usuario.getDtNasc());
        profissional.setDtConta(usuario.getDtConta());
        profissional.setNota(usuario.getNota());
        profissional.setTipo("PROFISSIONAL");

        return new ProfissionalResponseDTO(profissionalRepository.save(profissional));
    }
    
    @Transactional
    public ProfissionalResponseDTO atualizar(String id, ProfissionalRequestDTO dto) {

    	Profissional profissional = profissionalRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Profissional não encontrado. Id: " + id));

        /* 
    	if (profissionalRepository.existsByNomeAndIdNot(dto.getNome(), id)) {
            throw new BusinessException("Já existe uma profissional com esse nome.");
        }
    	
    	profissional.setNome(dto.getNome());
        */

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
