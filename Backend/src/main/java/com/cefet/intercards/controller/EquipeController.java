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

import com.cefet.intercards.dto.EquipeRequestDTO;
import com.cefet.intercards.dto.EquipeResponseDTO;
import com.cefet.intercards.service.EquipeService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/equipes")
@Tag(name = "Equipe")
public class EquipeController {

    @Autowired
    private EquipeService equipeService;

    @GetMapping
    @Operation(summary = "Listar equipes")
    public ResponseEntity<List<EquipeResponseDTO>> listar() {
        List<EquipeResponseDTO> equipes = equipeService.listar();
        return ResponseEntity.ok(equipes);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Buscar equipe por ID")
    public ResponseEntity<EquipeResponseDTO> buscarPorId(@PathVariable Long id) {
    	EquipeResponseDTO equipeResponseDTO = equipeService.buscarPorId(id);
        return ResponseEntity.ok(equipeResponseDTO);
    }

    @PostMapping
    @Operation(summary = "Cadastrar equipe")
    public ResponseEntity<EquipeResponseDTO> inserir(@Valid @RequestBody EquipeRequestDTO equipeRequestDTO) {
    	EquipeResponseDTO equipeResponseDTO = equipeService.inserir(equipeRequestDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(equipeResponseDTO);
    }
    
    @PutMapping("/{id}")
    @Operation(summary = "Atualizar equipe")
    public ResponseEntity<EquipeResponseDTO> atualizar(@PathVariable Long id, @Valid @RequestBody EquipeRequestDTO equipeRequestDTO) {

    	EquipeResponseDTO equipeResponseDTO = equipeService.atualizar(id, equipeRequestDTO);

        return ResponseEntity.ok(equipeResponseDTO);
    }    

    @DeleteMapping("/{id}")
    @Operation(summary = "Excluir equipe")
    public ResponseEntity<Void> excluir(@PathVariable Long id) {
        equipeService.excluir(id);
        return ResponseEntity.noContent().build();
    }

}