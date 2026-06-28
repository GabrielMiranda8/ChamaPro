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

import com.cefet.chamapro.dto.ProfissionalRequestDTO;
import com.cefet.chamapro.dto.ProfissionalResponseDTO;
import com.cefet.chamapro.service.ProfissionalService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/profissionais")
@CrossOrigin(origins = {"http://localhost:8100", "http://localhost:4200"})
@Tag(name = "Profissional")

public class ProfissionalController {

    @Autowired
    private ProfissionalService profissionalService;

    @GetMapping
    @Operation(summary = "Listar profissionals")
    public ResponseEntity<List<ProfissionalResponseDTO>> listar() {
        List<ProfissionalResponseDTO> profissionals = profissionalService.listar();
        return ResponseEntity.ok(profissionals);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Buscar profissional por ID")
    public ResponseEntity<ProfissionalResponseDTO> buscarPorId(@PathVariable String id) {
    	ProfissionalResponseDTO profissionalResponseDTO = profissionalService.buscarPorId(id);
        return ResponseEntity.ok(profissionalResponseDTO);
    }

    @PostMapping
    @Operation(summary = "Cadastrar profissional")
    public ResponseEntity<ProfissionalResponseDTO> inserir(@Valid @RequestBody ProfissionalRequestDTO profissionalRequestDTO) {
    	ProfissionalResponseDTO profissionalResponseDTO = profissionalService.inserir(profissionalRequestDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(profissionalResponseDTO);
    }
    
    @PutMapping("/{id}")
    @Operation(summary = "Atualizar profissional")
    public ResponseEntity<ProfissionalResponseDTO> atualizar(@PathVariable String id, @Valid @RequestBody ProfissionalRequestDTO profissionalRequestDTO) {

    	ProfissionalResponseDTO profissionalResponseDTO = profissionalService.atualizar(id, profissionalRequestDTO);

        return ResponseEntity.ok(profissionalResponseDTO);
    }    

    @DeleteMapping("/{id}")
    @Operation(summary = "Excluir profissional")
    public ResponseEntity<Void> excluir(@PathVariable String id) {
        profissionalService.excluir(id);
        return ResponseEntity.noContent().build();
    }
}
