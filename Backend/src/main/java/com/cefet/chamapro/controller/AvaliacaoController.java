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

import com.cefet.chamapro.dto.AvaliacaoRequestDTO;
import com.cefet.chamapro.dto.AvaliacaoResponseDTO;
import com.cefet.chamapro.service.AvaliacaoService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/avaliacoes")
@Tag(name = "Avaliacao")
public class AvaliacaoController {

    @Autowired
    private AvaliacaoService avaliacaoService;

    @GetMapping
    @Operation(summary = "Listar avaliacoes")
    public ResponseEntity<List<AvaliacaoResponseDTO>> listar() {
        List<AvaliacaoResponseDTO> avaliacoes = avaliacaoService.listar();
        return ResponseEntity.ok(avaliacoes);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Buscar avaliacao por ID")
    public ResponseEntity<AvaliacaoResponseDTO> buscarPorId(@PathVariable String id) {
    	AvaliacaoResponseDTO avaliacaoResponseDTO = avaliacaoService.buscarPorId(id);
        return ResponseEntity.ok(avaliacaoResponseDTO);
    }

    @GetMapping("/autor/{idAutor}")
    @Operation(summary = "Listar avaliacoes feitas por um usuário")
    public ResponseEntity<List<AvaliacaoResponseDTO>> listarPorAutor(@PathVariable String idAutor) {
        return ResponseEntity.ok(avaliacaoService.listarPorAutor(idAutor));
    }

    @GetMapping("/alvo/{idAlvo}")
    @Operation(summary = "Listar avaliacoes recebidas por um usuário")
    public ResponseEntity<List<AvaliacaoResponseDTO>> listarPorAlvo(@PathVariable String idAlvo) {
        return ResponseEntity.ok(avaliacaoService.listarPorAlvo(idAlvo));
    }

    @GetMapping("/pedido/{idPedido}")
    @Operation(summary = "Listar avaliacoes de um pedido")
    public ResponseEntity<List<AvaliacaoResponseDTO>> listarPorPedido(@PathVariable String idPedido) {
        return ResponseEntity.ok(avaliacaoService.listarPorPedido(idPedido));
    }

    @PostMapping
    @Operation(summary = "Cadastrar avaliacao")
    public ResponseEntity<AvaliacaoResponseDTO> inserir(@Valid @RequestBody AvaliacaoRequestDTO avaliacaoRequestDTO) {
    	AvaliacaoResponseDTO avaliacaoResponseDTO = avaliacaoService.inserir(avaliacaoRequestDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(avaliacaoResponseDTO);
    }
    
    @PutMapping("/{id}")
    @Operation(summary = "Atualizar avaliacao")
    public ResponseEntity<AvaliacaoResponseDTO> atualizar(@PathVariable String id, @Valid @RequestBody AvaliacaoRequestDTO avaliacaoRequestDTO) {

    	AvaliacaoResponseDTO avaliacaoResponseDTO = avaliacaoService.atualizar(id, avaliacaoRequestDTO);

        return ResponseEntity.ok(avaliacaoResponseDTO);
    }    

    @DeleteMapping("/{id}")
    @Operation(summary = "Excluir avaliacao")
    public ResponseEntity<Void> excluir(@PathVariable String id) {
        avaliacaoService.excluir(id);
        return ResponseEntity.noContent().build();
    }

}
