package com.cefet.chamapro.service;

import com.cefet.chamapro.dto.ClienteRequestDTO;
import com.cefet.chamapro.dto.ClienteResponseDTO;
import com.cefet.chamapro.dto.EnderecoRequestDTO;
import com.cefet.chamapro.dto.ProfissionalRequestDTO;
import com.cefet.chamapro.dto.ProfissionalResponseDTO;
import com.cefet.chamapro.dto.UsuarioRequestDTO;
import com.cefet.chamapro.dto.UsuarioResponseDTO;
import com.cefet.chamapro.entity.Cliente;
import com.cefet.chamapro.entity.Endereco;
import com.cefet.chamapro.entity.Profissional;
import com.cefet.chamapro.entity.Usuario;
import com.cefet.chamapro.repository.EnderecoRepository;
import com.cefet.chamapro.repository.UsuarioRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

@Service
@RequiredArgsConstructor
public class UsuarioService {

    private final UsuarioRepository repository;
    private final EnderecoRepository enderecoRepository;

    public UsuarioResponseDTO criar(UsuarioRequestDTO dto) {
        if (repository.existsByEmail(dto.email())) {
            throw new IllegalArgumentException("Email já cadastrado");
        }
        if (repository.existsByCpf(dto.cpf())) {
            throw new IllegalArgumentException("CPF já cadastrado");
        }

        
        Usuario usuario = switch (dto.tipo()) {
            case "PROFISSIONAL" -> new Profissional();
            case "CLIENTE" -> new Cliente();
            default -> throw new IllegalArgumentException("Tipo de usuário inválido");
        };

        usuario.setNome(dto.nome());
        usuario.setEmail(dto.email());
        usuario.setSenha(dto.senha());
        usuario.setCpf(dto.cpf());
        usuario.setDtNasc(dto.dtNasc());
        usuario.setDtConta(new Date());
        usuario.setNota(dto.nota() != null ? dto.nota() : 0.0);
        usuario.setTipo(dto.tipo());

        Usuario salvo = repository.save(usuario);

        
        if (dto.endereco() != null) {
            Endereco endereco = dto.endereco();
            endereco.setUsuario(salvo);
            enderecoRepository.save(endereco);
        }

        return toResponseDTO(salvo);
    }


    public UsuarioResponseDTO buscarPorId(String id) {
        Usuario usuario = repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Usuário não encontrado"));
        return toResponseDTO(usuario);
    }

    public List<UsuarioResponseDTO> listarTodos() {
        return repository.findAll().stream()
                .map(this::toResponseDTO)
                .toList();
    }

    public UsuarioResponseDTO atualizar(String id, UsuarioRequestDTO dto) {
        Usuario usuario = repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Usuário não encontrado"));

        usuario.setNome(dto.nome());
        usuario.setEmail(dto.email());
        usuario.setSenha(dto.senha());
        usuario.setCpf(dto.cpf());
        usuario.setDtNasc(dto.dtNasc());
        usuario.setNota(dto.nota());
        usuario.setTipo(dto.tipo());

        Usuario atualizado = repository.save(usuario);
        return toResponseDTO(atualizado);
    }

    public void deletar(String id) {
        if (!repository.existsById(id)) {
            throw new EntityNotFoundException("Usuário não encontrado");
        }
        repository.deleteById(id);
    }

    private UsuarioResponseDTO toResponseDTO(Usuario usuario) {
        return new UsuarioResponseDTO(
                usuario.getId(),
                usuario.getNome(),
                usuario.getDtNasc(),
                usuario.getDtConta(),
                usuario.getNota());
    }
}