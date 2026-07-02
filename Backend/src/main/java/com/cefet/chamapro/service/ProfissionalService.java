package com.cefet.chamapro.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.cefet.chamapro.dto.ProfissionalRequestDTO;
import com.cefet.chamapro.dto.ProfissionalResponseDTO;
import com.cefet.chamapro.entity.Profissional;
import com.cefet.chamapro.entity.Usuario;
import com.cefet.chamapro.exception.ResourceNotFoundException;
import com.cefet.chamapro.repository.ProfissionalRepository;
import com.cefet.chamapro.repository.UsuarioRepository;

import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityNotFoundException;
import jakarta.persistence.PersistenceContext;

@Service
public class ProfissionalService {
    @Autowired
    private ProfissionalRepository profissionalRepository;
    @Autowired
    private UsuarioRepository usuarioRepository;

    @PersistenceContext
    private EntityManager entityManager;


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

        // A herança é JOINED (tb_usuario -> tb_cliente -> tb_profissional). Não dá pra
        // criar um "new Profissional()" com o id copiado e chamar save()/merge(): como o
        // id já existe em tb_usuario mas não em tb_cliente/tb_profissional, o Hibernate
        // não encontra a linha via JOIN e tenta INSERIR de novo em tb_usuario inteiro,
        // o que quebra por causa da PK e das colunas únicas (nome/email/cpf). Por isso
        // inserimos direto, só as linhas filhas, reaproveitando o id existente.
        entityManager.createNativeQuery("INSERT INTO tb_cliente (id) VALUES (?1)")
                .setParameter(1, usuario.getId())
                .executeUpdate();

        entityManager.createNativeQuery("INSERT INTO tb_profissional (id) VALUES (?1)")
                .setParameter(1, usuario.getId())
                .executeUpdate();

        entityManager.flush();
        entityManager.clear();

        Profissional profissional = profissionalRepository.findById(usuario.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Falha ao promover usuário a profissional."));

        return new ProfissionalResponseDTO(profissional);
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
