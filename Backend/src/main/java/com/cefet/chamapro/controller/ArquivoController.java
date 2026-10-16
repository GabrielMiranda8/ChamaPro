package com.cefet.chamapro.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.cefet.chamapro.entity.Arquivo;
import com.cefet.chamapro.service.ArquivoService;

import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/arquivos")
@Tag(name = "Arquivo")
@RequiredArgsConstructor
public class ArquivoController {

    private final ArquivoService arquivoService;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Arquivo> upload(@RequestParam("arquivo") MultipartFile arquivo) {
        return ResponseEntity.status(HttpStatus.CREATED).body(arquivoService.salvar(arquivo));
    }

    @GetMapping
    public ResponseEntity<List<Arquivo>> listar() {
        return ResponseEntity.ok(arquivoService.listar());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Arquivo> buscarPorId(@PathVariable String id) {
        return ResponseEntity.ok(arquivoService.buscarPorId(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable String id) {
        arquivoService.excluir(id);
        return ResponseEntity.noContent().build();
    }
}