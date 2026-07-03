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

import com.cefet.chamapro.dto.ServicoRequestDTO;
import com.cefet.chamapro.dto.ServicoResponseDTO;
import com.cefet.chamapro.service.ServicoService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/servicos")
@Tag(name = "Servico")

public class ServicoController {

    @Autowired
    private ServicoService servicoService;

    @GetMapping
    @Operation(summary = "Listar servicos")
    public ResponseEntity<List<ServicoResponseDTO>> listar() {
        List<ServicoResponseDTO> servicos = servicoService.listar();
        return ResponseEntity.ok(servicos);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Buscar servico por ID")
    public ResponseEntity<ServicoResponseDTO> buscarPorId(@PathVariable String id) {
    	ServicoResponseDTO servicoResponseDTO = servicoService.buscarPorId(id);
        return ResponseEntity.ok(servicoResponseDTO);
    }

    @PostMapping
    @Operation(summary = "Cadastrar servico")
    public ResponseEntity<ServicoResponseDTO> inserir(@Valid @RequestBody ServicoRequestDTO servicoRequestDTO) {
    	ServicoResponseDTO servicoResponseDTO = servicoService.inserir(servicoRequestDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(servicoResponseDTO);
    }
    
    @PutMapping("/{id}")
    @Operation(summary = "Atualizar servico")
    public ResponseEntity<ServicoResponseDTO> atualizar(@PathVariable String id, @Valid @RequestBody ServicoRequestDTO servicoRequestDTO) {

    	ServicoResponseDTO servicoResponseDTO = servicoService.atualizar(id, servicoRequestDTO);

        return ResponseEntity.ok(servicoResponseDTO);
    }    

    @DeleteMapping("/{id}")
    @Operation(summary = "Excluir servico")
    public ResponseEntity<Void> excluir(@PathVariable String id) {
        servicoService.excluir(id);
        return ResponseEntity.noContent().build();
    }
}
