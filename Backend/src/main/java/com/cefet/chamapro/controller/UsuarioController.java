package com.cefet.chamapro.controller;

import com.cefet.chamapro.dto.UsuarioRequestDTO;
import com.cefet.chamapro.dto.UsuarioResponseDTO;
import com.cefet.chamapro.service.UsuarioService;

import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/usuarios")
@Tag(name = "Usuario")
@RequiredArgsConstructor
public class UsuarioController {

    private final UsuarioService service;

    @PostMapping
    public ResponseEntity<UsuarioResponseDTO> criar(@RequestBody @Valid UsuarioRequestDTO dto) {
        UsuarioResponseDTO criado = service.criar(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(criado);
    }

    @GetMapping
    public ResponseEntity<List<UsuarioResponseDTO>> listarTodos() {
        return ResponseEntity.ok(service.listarTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<UsuarioResponseDTO> buscarPorId(@PathVariable String id) {
        return ResponseEntity.ok(service.buscarPorId(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<UsuarioResponseDTO> atualizar(@PathVariable String id, @RequestBody @Valid UsuarioRequestDTO dto) {
        return ResponseEntity.ok(service.atualizar(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable String id) {
        service.deletar(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/senha")
    public ResponseEntity<String> alterarSenha(@PathVariable String id, @RequestBody Map<String, String> body) {
        service.alterarSenha(id, body.get("senha"));
        return ResponseEntity.ok("Senha alterada com sucesso");
    }

    @PatchMapping("/{id}/cep")
    public ResponseEntity<String> alterarCep(@PathVariable String id, @RequestBody Map<String, String> body) {
        service.alterarCep(id, body.get("cep"));
        return ResponseEntity.ok("CEP alterado com sucesso");
    }
}