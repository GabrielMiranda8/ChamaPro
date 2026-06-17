package com.cefet.intercards.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.cefet.intercards.dto.ModalidadeRequestDTO;
import com.cefet.intercards.dto.ModalidadeResponseDTO;
import com.cefet.intercards.service.ModalidadeService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/modalidades")
@Tag(name = "Modalidade")
public class ModalidadeController {

    @Autowired
    private ModalidadeService modalidadeService;

    @GetMapping
    @Operation(summary = "Listar modalidades")
    public ResponseEntity<List<ModalidadeResponseDTO>> listar() {
        List<ModalidadeResponseDTO> modalidades = modalidadeService.listar();
        return ResponseEntity.ok(modalidades);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Buscar modalidade por ID")
    public ResponseEntity<ModalidadeResponseDTO> buscarPorId(@PathVariable Long id) {
    	ModalidadeResponseDTO modalidadeResponseDTO = modalidadeService.buscarPorId(id);
        return ResponseEntity.ok(modalidadeResponseDTO);
    }

    @PostMapping
    @Operation(summary = "Cadastrar modalidade")
    public ResponseEntity<ModalidadeResponseDTO> inserir(@Valid @RequestBody ModalidadeRequestDTO modalidadeRequestDTO) {
    	ModalidadeResponseDTO modalidadeResponseDTO = modalidadeService.inserir(modalidadeRequestDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(modalidadeResponseDTO);
    }
    
    @PutMapping("/{id}")
    @Operation(summary = "Atualizar modalidade")
    public ResponseEntity<ModalidadeResponseDTO> atualizar(@PathVariable Long id, @Valid @RequestBody ModalidadeRequestDTO modalidadeRequestDTO) {

    	ModalidadeResponseDTO modalidadeResponseDTO = modalidadeService.atualizar(id, modalidadeRequestDTO);

        return ResponseEntity.ok(modalidadeResponseDTO);
    }    

    @DeleteMapping("/{id}")
    @Operation(summary = "Excluir modalidade")
    public ResponseEntity<Void> excluir(@PathVariable Long id) {
        modalidadeService.excluir(id);
        return ResponseEntity.noContent().build();
    }

}