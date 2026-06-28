package com.cefet.chamapro.service;

import com.cefet.chamapro.dto.ClienteRequestDTO;
import com.cefet.chamapro.dto.ClienteResponseDTO;
import com.cefet.chamapro.dto.EnderecoRequestDTO;
import com.cefet.chamapro.dto.ProfissionalRequestDTO;
import com.cefet.chamapro.dto.ProfissionalResponseDTO;
import com.cefet.chamapro.dto.UsuarioRequestDTO;
import com.cefet.chamapro.dto.UsuarioResponseDTO;
import com.cefet.chamapro.entity.Usuario;
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
    private final EnderecoService enderecoService;
    private final ProfissionalService profissionalService;
    private final ClienteService clienteService;

    public UsuarioResponseDTO criar(UsuarioRequestDTO dto) {
    if (repository.existsByEmail(dto.email())) {
        throw new IllegalArgumentException("Email já cadastrado");
    }
    if (repository.existsByCpf(dto.cpf())) {
        throw new IllegalArgumentException("CPF já cadastrado");
    }

    // Decide o tipo e delega
    if ("PROFISSIONAL".equals(dto.tipo())) {
        ProfissionalResponseDTO profissional = profissionalService.inserir(new ProfissionalRequestDTO(dto.usuarioId()));
        EnderecoRequestDTO endereco = new EnderecoRequestDTO();
        endereco.setCep(dto.endereco().getCep());
        endereco.setIdUsuario(profissional.getId());
        enderecoService.inserir(endereco);
        return new UsuarioResponseDTO(profissional.getId(), profissional.getNome(),
                                      profissional.getDtNasc(), profissional.getDtConta(), profissional.getNota());
    } else {
        ClienteResponseDTO cliente = clienteService.criar(new ClienteRequestDTO(dto.usuarioId()));
        EnderecoRequestDTO endereco = new EnderecoRequestDTO();
        endereco.setCep(dto.endereco().getCep());
        endereco.setIdUsuario(cliente.id());
        enderecoService.inserir(endereco);
        return new UsuarioResponseDTO(cliente.id(), cliente.nome(),
                                      cliente.dtNasc(), cliente.dtConta(), cliente.nota());
    }
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