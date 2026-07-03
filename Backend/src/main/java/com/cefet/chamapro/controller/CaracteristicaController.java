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

import com.cefet.chamapro.dto.CaracteristicaRequestDTO;
import com.cefet.chamapro.dto.CaracteristicaResponseDTO;
import com.cefet.chamapro.service.CaracteristicaService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/caracteristicas")
@Tag(name = "Caracteristica")
public class CaracteristicaController {

    @Autowired
    private CaracteristicaService caracteristicaService;

    @GetMapping
    @Operation(summary = "Listar características")
    public ResponseEntity<List<CaracteristicaResponseDTO>> listar() {
        List<CaracteristicaResponseDTO> caracteristicas = caracteristicaService.listar();
        return ResponseEntity.ok(caracteristicas);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Buscar característica por ID")
    public ResponseEntity<CaracteristicaResponseDTO> buscarPorId(@PathVariable String id) {
    	CaracteristicaResponseDTO caracteristicaResponseDTO = caracteristicaService.buscarPorId(id);
        return ResponseEntity.ok(caracteristicaResponseDTO);
    }

    @PostMapping
    @Operation(summary = "Cadastrar característica")
    public ResponseEntity<CaracteristicaResponseDTO> inserir(@Valid @RequestBody CaracteristicaRequestDTO caracteristicaRequestDTO) {
    	CaracteristicaResponseDTO caracteristicaResponseDTO = caracteristicaService.inserir(caracteristicaRequestDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(caracteristicaResponseDTO);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Atualizar característica")
    public ResponseEntity<CaracteristicaResponseDTO> atualizar(@PathVariable String id, @Valid @RequestBody CaracteristicaRequestDTO caracteristicaRequestDTO) {
    	CaracteristicaResponseDTO caracteristicaResponseDTO = caracteristicaService.atualizar(id, caracteristicaRequestDTO);
        return ResponseEntity.ok(caracteristicaResponseDTO);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Excluir característica")
    public ResponseEntity<Void> excluir(@PathVariable String id) {
        caracteristicaService.excluir(id);
        return ResponseEntity.noContent().build();
    }
}