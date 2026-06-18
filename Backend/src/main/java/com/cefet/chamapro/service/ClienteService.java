package com.cefet.chamapro.service;

import com.cefet.chamapro.dto.ClienteRequestDTO;
import com.cefet.chamapro.dto.ClienteResponseDTO;
import com.cefet.chamapro.entity.Cliente;
import com.cefet.chamapro.repository.ClienteRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ClienteService {

    private final ClienteRepository repository;

    public ClienteResponseDTO criar(ClienteRequestDTO dto) {
        Cliente cliente = new Cliente();
        cliente.setNome(dto.nome());
        cliente.setEmail(dto.email());
        cliente.setSenha(dto.senha());
        cliente.setCpf(dto.cpf());
        cliente.setDtNasc(dto.dtNasc());
        cliente.setDtConta(new Date());
        cliente.setNota(dto.nota());
        cliente.setTipo("CLIENTE");

        Cliente salvo = repository.save(cliente);
        return toResponseDTO(salvo);
    }

    public ClienteResponseDTO buscarPorId(String id) {
        Cliente cliente = repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Cliente não encontrado"));
        return toResponseDTO(cliente);
    }

    public List<ClienteResponseDTO> listarTodos() {
        return repository.findAll().stream()
                .map(this::toResponseDTO)
                .toList();
    }

    public ClienteResponseDTO atualizar(String id, ClienteRequestDTO dto) {
        Cliente cliente = repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Cliente não encontrado"));

        cliente.setNome(dto.nome());
        cliente.setEmail(dto.email());
        cliente.setSenha(dto.senha());
        cliente.setCpf(dto.cpf());
        cliente.setDtNasc(dto.dtNasc());
        cliente.setNota(dto.nota());

        Cliente atualizado = repository.save(cliente);
        return toResponseDTO(atualizado);
    }

    public void deletar(String id) {
        if (!repository.existsById(id)) {
            throw new EntityNotFoundException("Cliente não encontrado");
        }
        repository.deleteById(id);
    }

    private ClienteResponseDTO toResponseDTO(Cliente cliente) {
        return new ClienteResponseDTO(
                cliente.getId(),
                cliente.getNome(),
                cliente.getEmail(),
                cliente.getDtNasc(),
                cliente.getDtConta(),
                cliente.getNota()
        );
    }
}