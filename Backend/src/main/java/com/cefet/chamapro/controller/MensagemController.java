package com.cefet.chamapro.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.cefet.chamapro.dto.MensagemResponseDTO;
import com.cefet.chamapro.security.TokenUsuarioResolver;
import com.cefet.chamapro.service.MensagemService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;

@RestController
@RequestMapping("/mensagens")
@Tag(name = "Mensagens")
public class MensagemController {

    @Autowired
    private MensagemService mensagemService;

    @Autowired
    private TokenUsuarioResolver tokenUsuarioResolver;

    @GetMapping("/pedido/{idPedido}")
    @Operation(summary = "Listar histórico de mensagens de um pedido")
    public ResponseEntity<List<MensagemResponseDTO>> listarPorPedido(@PathVariable String idPedido) {
        String idUsuarioLogado = tokenUsuarioResolver.idDoUsuarioAutenticado();
        return ResponseEntity.ok(mensagemService.listarPorPedido(idPedido, idUsuarioLogado));
    }

    @PatchMapping("/pedido/{idPedido}/marcar-lidas")
    @Operation(summary = "Marcar mensagens de um pedido como lidas")
    public ResponseEntity<Void> marcarComoLidas(@PathVariable String idPedido) {
        String idUsuarioLogado = tokenUsuarioResolver.idDoUsuarioAutenticado();
        mensagemService.marcarComoLidas(idPedido, idUsuarioLogado);
        return ResponseEntity.noContent().build();
    }
}