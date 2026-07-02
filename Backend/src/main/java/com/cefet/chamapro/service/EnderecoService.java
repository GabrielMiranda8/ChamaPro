package com.cefet.chamapro.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.cefet.chamapro.dto.EnderecoRequestDTO;
import com.cefet.chamapro.dto.EnderecoResponseDTO;
import com.cefet.chamapro.entity.Endereco;
import com.cefet.chamapro.entity.Usuario;
import com.cefet.chamapro.exception.BusinessException;
import com.cefet.chamapro.exception.ResourceNotFoundException;
import com.cefet.chamapro.repository.EnderecoRepository;
import com.cefet.chamapro.repository.UsuarioRepository;

@Service
public class EnderecoService {
    @Autowired
    private EnderecoRepository enderecoRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Transactional(readOnly = true)
    public List<EnderecoResponseDTO> listar() {
        List<Endereco> enderecos = enderecoRepository.findAll();
        return enderecos.stream().map(EnderecoResponseDTO::new).toList();
    }

    @Transactional(readOnly = true)
    public EnderecoResponseDTO buscarPorId(String id) {
        Endereco endereco = enderecoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Endereco não encontrado. Id: " + id));

        return new EnderecoResponseDTO(endereco);
    }

    @Transactional
    public EnderecoResponseDTO inserir(EnderecoRequestDTO dto) {

        if (enderecoRepository.existsByCep(dto.getCep())) {
            throw new BusinessException("Já existe uma endereco com esse nome.");
        }

        Usuario usuario = usuarioRepository.findById(dto.getIdUsuario())
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado. Id: " + dto.getIdUsuario()));

        Endereco endereco = new Endereco();
        endereco.setCep(dto.getCep());
        endereco.setBairro(dto.getBairro());
        endereco.setCidade(dto.getCidade());
        endereco.setComplemento(dto.getComplemento());
        endereco.setNumero(dto.getNumero());
        endereco.setReferencia(dto.getReferencia());
        endereco.setRua(dto.getRua());
        endereco.setUsuario(usuario);

        return new EnderecoResponseDTO(enderecoRepository.save(endereco));
    }

    @Transactional
    public EnderecoResponseDTO atualizar(String id, EnderecoRequestDTO dto) {

        Endereco endereco = enderecoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Endereco não encontrado. Id: " + id));

        if (enderecoRepository.existsByCepAndIdNot(dto.getCep(), id)) {
            throw new BusinessException("Já existe uma endereco com esse nome.");
        }

        endereco.setCep(dto.getCep());

        return new EnderecoResponseDTO(enderecoRepository.save(endereco));
    }

    @Transactional
    public void excluir(String id) {
        if (!enderecoRepository.existsById(id)) {
            throw new ResourceNotFoundException("Endereco não encontrado com ID: " + id);
        }
        enderecoRepository.deleteById(id);
    }
}
