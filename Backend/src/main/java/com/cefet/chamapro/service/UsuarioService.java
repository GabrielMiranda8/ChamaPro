package com.cefet.chamapro.service;

import com.cefet.chamapro.dto.UsuarioRequestDTO;
import com.cefet.chamapro.dto.UsuarioResponseDTO;
import com.cefet.chamapro.entity.Usuario;
import com.cefet.chamapro.repository.UsuarioRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Date;
import java.util.List;

@Service
@RequiredArgsConstructor
public class UsuarioService {

    private final UsuarioRepository repository;

    public UsuarioResponseDTO criar(UsuarioRequestDTO dto) {
        if (repository.existsByEmail(dto.email())) {
            throw new IllegalArgumentException("Email já cadastrado");
        }
        if (repository.existsByCpf(dto.cpf())) {
            throw new IllegalArgumentException("CPF já cadastrado");
        }

        Usuario usuario = new Usuario();
        usuario.setNome(dto.nome());
        usuario.setEmail(dto.email());
        usuario.setSenha(dto.senha());
        usuario.setCpf(dto.cpf());
        usuario.setDtNasc(dto.dtNasc());
        usuario.setDtConta(new Date());
        usuario.setNota(dto.nota());
        usuario.setTipo(dto.tipo());

        Usuario salvo = repository.save(usuario);
        return toResponseDTO(salvo);
    }

    public UsuarioResponseDTO buscarPorId(Long id) {
        Usuario usuario = repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Usuário não encontrado"));
        return toResponseDTO(usuario);
    }

    public List<UsuarioResponseDTO> listarTodos() {
        return repository.findAll().stream()
                .map(this::toResponseDTO)
                .toList();
    }

    public UsuarioResponseDTO atualizar(Long id, UsuarioRequestDTO dto) {
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

    public void deletar(Long id) {
        if (!repository.existsById(id)) {
            throw new EntityNotFoundException("Usuário não encontrado");
        }
        repository.deleteById(id);
    }

    private UsuarioResponseDTO toResponseDTO(Usuario usuario) {
        return new UsuarioResponseDTO(
                usuario.getId(),
                usuario.getNome(),
                usuario.getEmail(),
                usuario.getCpf(),
                usuario.getDtNasc(),
                usuario.getDtConta(),
                usuario.getNota(),
                usuario.getTipo()
        );
    }
}