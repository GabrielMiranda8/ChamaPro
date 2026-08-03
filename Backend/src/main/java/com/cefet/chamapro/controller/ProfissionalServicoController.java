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

import com.cefet.chamapro.dto.ProfissionalServicoRequestDTO;
import com.cefet.chamapro.dto.ProfissionalServicoResponseDTO;
import com.cefet.chamapro.service.ProfissionalServicoService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/profissionalservico")
@Tag(name = "Servicos de Profissionais")

public class ProfissionalServicoController {

    @Autowired
    private ProfissionalServicoService psService;

    @GetMapping
    @Operation(summary = "Listar pss")
    public ResponseEntity<List<ProfissionalServicoResponseDTO>> listar() {
        List<ProfissionalServicoResponseDTO> pss = psService.listar();
        return ResponseEntity.ok(pss);
    }

    @GetMapping("/profissional/{idProfissional}")
    @Operation(summary = "Listar serviços de um profissional")
    public ResponseEntity<List<ProfissionalServicoResponseDTO>> listarPorProfissional(@PathVariable String idProfissional) {
        return ResponseEntity.ok(psService.listarPorProfissional(idProfissional));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Buscar ps por ID")
    public ResponseEntity<ProfissionalServicoResponseDTO> buscarPorId(@PathVariable String id) {
    	ProfissionalServicoResponseDTO psResponseDTO = psService.buscarPorId(id);
        return ResponseEntity.ok(psResponseDTO);
    }

    @PostMapping
    @Operation(summary = "Cadastrar ps")
    public ResponseEntity<ProfissionalServicoResponseDTO> inserir(@Valid @RequestBody ProfissionalServicoRequestDTO psRequestDTO) {
    	ProfissionalServicoResponseDTO psResponseDTO = psService.inserir(psRequestDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(psResponseDTO);
    }
    
    @PutMapping("/{id}")
    @Operation(summary = "Atualizar ps")
    public ResponseEntity<ProfissionalServicoResponseDTO> atualizar(@PathVariable String id, @Valid @RequestBody ProfissionalServicoRequestDTO psRequestDTO) {

    	ProfissionalServicoResponseDTO psResponseDTO = psService.atualizar(id, psRequestDTO);

        return ResponseEntity.ok(psResponseDTO);
    }    

    @DeleteMapping("/profissional/{idProfissional}/servico/{idServico}")
    @Operation(summary = "Excluir serviço de um profissional")
    public ResponseEntity<Void> excluirPorProfissionalServico(@PathVariable String idProfissional, @PathVariable String idServico) {
        psService.excluirPorProfissionalServico(idProfissional, idServico);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Excluir ps")
    public ResponseEntity<Void> excluir(@PathVariable String id) {
        psService.excluir(id);
        return ResponseEntity.noContent().build();
    }
}
