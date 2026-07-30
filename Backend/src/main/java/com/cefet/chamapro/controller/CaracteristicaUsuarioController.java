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

import com.cefet.chamapro.dto.CaracteristicaUsuarioRequestDTO;
import com.cefet.chamapro.dto.CaracteristicaUsuarioResponseDTO;
import com.cefet.chamapro.service.CaracteristicaUsuarioService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/caracteristicausuario")

public class CaracteristicaUsuarioController {

    @Autowired
    private CaracteristicaUsuarioService cuService;

    @GetMapping
    @Operation(summary = "Listar caracteristicausuario")
    public ResponseEntity<List<CaracteristicaUsuarioResponseDTO>> listar() {
        List<CaracteristicaUsuarioResponseDTO> cus = cuService.listar();
        return ResponseEntity.ok(cus);
    }

    @GetMapping("/caracteristica/{idCaracteristica}")
    @Operation(summary = "Listar usuarios de um caracteristica")
    public ResponseEntity<List<CaracteristicaUsuarioResponseDTO>> listarPorCaracteristica(@PathVariable String idCaracteristica) {
        return ResponseEntity.ok(cuService.listarPorCaracteristica(idCaracteristica));
    }

    @GetMapping("/usuario/{idUsuario}")
    @Operation(summary = "Listar caracteristicas de um usuario")
    public ResponseEntity<List<CaracteristicaUsuarioResponseDTO>> listarPorUsuario(@PathVariable String idUsuario) {
        return ResponseEntity.ok(cuService.listarPorUsuario(idUsuario));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Buscar caracterisca de usuario por ID")
    public ResponseEntity<CaracteristicaUsuarioResponseDTO> buscarPorId(@PathVariable String id) {
    	CaracteristicaUsuarioResponseDTO cuResponseDTO = cuService.buscarPorId(id);
        return ResponseEntity.ok(cuResponseDTO);
    }

    @PostMapping
    @Operation(summary = "Cadastrar caracteristica de ausuario")
    public ResponseEntity<CaracteristicaUsuarioResponseDTO> inserir(@Valid @RequestBody CaracteristicaUsuarioRequestDTO cuRequestDTO) {
    	CaracteristicaUsuarioResponseDTO cuResponseDTO = cuService.inserir(cuRequestDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(cuResponseDTO);
    }
    
    @PutMapping("/{id}")
    @Operation(summary = "Atualizar cu")
    public ResponseEntity<CaracteristicaUsuarioResponseDTO> atualizar(@PathVariable String id, @Valid @RequestBody CaracteristicaUsuarioRequestDTO cuRequestDTO) {

    	CaracteristicaUsuarioResponseDTO cuResponseDTO = cuService.atualizar(id, cuRequestDTO);

        return ResponseEntity.ok(cuResponseDTO);
    }    

    @DeleteMapping("/caracteristica/{idCaracteristica}/usuario/{idUsuario}")
    @Operation(summary = "Excluir usuario de um caracteristica")
    public ResponseEntity<Void> excluirUsuarioPorCaracteristica(@PathVariable String idCaracteristica, @PathVariable String idUsuario) {
        cuService.excluirUsuarioPorCaracteristica(idCaracteristica, idUsuario);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Excluir caracteristica de usuario")
    public ResponseEntity<Void> excluir(@PathVariable String id) {
        cuService.excluir(id);
        return ResponseEntity.noContent().build();
    }
}
