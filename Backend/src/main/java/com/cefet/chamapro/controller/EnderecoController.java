package com.cefet.chamapro.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.cefet.chamapro.dto.EnderecoRequestDTO;
import com.cefet.chamapro.dto.EnderecoResponseDTO;
import com.cefet.chamapro.service.EnderecoService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/enderecos")
@Tag(name = "Endereco")
public class EnderecoController {

    @Autowired
    private EnderecoService enderecoService;

    @GetMapping
    @Operation(summary = "Listar enderecos")
    public ResponseEntity<List<EnderecoResponseDTO>> listar() {
        List<EnderecoResponseDTO> enderecos = enderecoService.listar();
        return ResponseEntity.ok(enderecos);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Buscar endereco por ID")
    public ResponseEntity<EnderecoResponseDTO> buscarPorId(@PathVariable String id) {
    	EnderecoResponseDTO enderecoResponseDTO = enderecoService.buscarPorId(id);
        return ResponseEntity.ok(enderecoResponseDTO);
    }

    @GetMapping("/usuario/{idUsuario}")
    @Operation(summary = "Listar enderecos de um usuário")
    public ResponseEntity<List<EnderecoResponseDTO>> listarPorUsuario(@PathVariable String idUsuario) {
        List<EnderecoResponseDTO> enderecos = enderecoService.listarPorUsuario(idUsuario);
        return ResponseEntity.ok(enderecos);
    }

    @PostMapping
    @Operation(summary = "Cadastrar endereco")
    public ResponseEntity<EnderecoResponseDTO> inserir(@Valid @RequestBody EnderecoRequestDTO enderecoRequestDTO) {
    	EnderecoResponseDTO enderecoResponseDTO = enderecoService.inserir(enderecoRequestDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(enderecoResponseDTO);
    }
    
    @PutMapping("/{id}")
    @Operation(summary = "Atualizar endereco")
    public ResponseEntity<EnderecoResponseDTO> atualizar(@PathVariable String id, @Valid @RequestBody EnderecoRequestDTO enderecoRequestDTO) {

    	EnderecoResponseDTO enderecoResponseDTO = enderecoService.atualizar(id, enderecoRequestDTO);

        return ResponseEntity.ok(enderecoResponseDTO);
    }    

    @DeleteMapping("/{id}")
    @Operation(summary = "Excluir endereco")
    public ResponseEntity<Void> excluir(@PathVariable String id) {
        enderecoService.excluir(id);
        return ResponseEntity.noContent().build();
    }

}