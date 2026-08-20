package com.cefet.chamapro.controller;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.cefet.chamapro.dto.CompromissoResponseDTO;
import com.cefet.chamapro.service.CompromissoService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/compromissos")
@Tag(name = "Compromissos")
public class CompromissoController {

    @Autowired
    private CompromissoService cService;

    @GetMapping("/profissional/{idProfissional}")
    @Operation(summary = "Listar horários ocupados de um profissional em uma data")
    public ResponseEntity<List<CompromissoResponseDTO>> listarPorProfissionalEData(
            @PathVariable String idProfissional,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate data) {
        return ResponseEntity.ok(cService.listarPorProfissionalEData(idProfissional, data));
    }

    @GetMapping("/profissional/{idProfissional}/agenda")
    @Operation(summary = "Listar agenda de um profissional")
    public ResponseEntity<List<CompromissoResponseDTO>> listarAgendaDoProfissional(
            @PathVariable String idProfissional) {
        return ResponseEntity.ok(cService.listarAgendaDoProfissional(idProfissional));
    }
}