package com.cefet.chamapro.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.cefet.chamapro.dto.AceitarPedidoDTO;
import com.cefet.chamapro.dto.PedidoRequestDTO;
import com.cefet.chamapro.dto.PedidoResponseDTO;
import com.cefet.chamapro.service.PedidoService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/pedidos")
@Tag(name = "Pedidos")
public class PedidoController {

    @Autowired
    private PedidoService pService;

    @GetMapping
    @Operation(summary = "Listar pedidos")
    public ResponseEntity<List<PedidoResponseDTO>> listar() {
        List<PedidoResponseDTO> ps = pService.listar();
        return ResponseEntity.ok(ps);
    }

    @GetMapping("/profissional/{idProfissional}")
    @Operation(summary = "Listar pedidos de um profissional")
    public ResponseEntity<List<PedidoResponseDTO>> listarPorProfissional(@PathVariable String idProfissional) {
        return ResponseEntity.ok(pService.listarPorProfissional(idProfissional));
    }

    @GetMapping("/cliente/{idCliente}")
    @Operation(summary = "Listar pedidos de um cliente")
    public ResponseEntity<List<PedidoResponseDTO>> listarPorCliente(@PathVariable String idCliente) {
        return ResponseEntity.ok(pService.listarPorCliente(idCliente));
    }

    @GetMapping("/usuario/{idUsuario}")
    @Operation(summary = "Listar pedidos de um usuário")
    public ResponseEntity<List<PedidoResponseDTO>> listarPorUsuario(@PathVariable String idUsuario) {
        return ResponseEntity.ok(pService.listarPorUsuario(idUsuario));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Buscar pedido por ID")
    public ResponseEntity<PedidoResponseDTO> buscarPorId(@PathVariable String id) {
        PedidoResponseDTO pResponseDTO = pService.buscarPorId(id);
        return ResponseEntity.ok(pResponseDTO);
    }

    @PostMapping
    @Operation(summary = "Cadastrar pedido")
    public ResponseEntity<PedidoResponseDTO> inserir(@Valid @RequestBody PedidoRequestDTO pRequestDTO) {
        PedidoResponseDTO pResponseDTO = pService.inserir(pRequestDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(pResponseDTO);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Alterar pedido")
    public ResponseEntity<PedidoResponseDTO> atualizar(@PathVariable String id,
            @Valid @RequestBody PedidoRequestDTO pRequestDTO) {

        PedidoResponseDTO pResponseDTO = pService.atualizar(id, pRequestDTO);

        return ResponseEntity.ok(pResponseDTO);
    }

    @PatchMapping("/{id}/aceitar")
    @Operation(summary = "Aceitar pedido e agendar horário na agenda do profissional")
    public ResponseEntity<PedidoResponseDTO> aceitar(@PathVariable String id,
            @Valid @RequestBody AceitarPedidoDTO dto) {
        PedidoResponseDTO pedidoResponseDTO = pService.aceitar(id, dto);
        return ResponseEntity.ok(pedidoResponseDTO);
    }
    
    @PatchMapping("/{id}/status")
    @Operation(summary = "Atualizar status do pedido")
    public ResponseEntity<PedidoResponseDTO> atualizarStatus(@PathVariable String id) {
        PedidoResponseDTO pedidoResponseDTO = pService.atualizarStatus(id);
        return ResponseEntity.ok(pedidoResponseDTO);
    }

    @PatchMapping("/{id}/recusar")
    @Operation(summary = "Recusar pedido")
    public ResponseEntity<PedidoResponseDTO> recusar(@PathVariable String id) {
        PedidoResponseDTO pedidoResponseDTO = pService.recusar(id);
        return ResponseEntity.ok(pedidoResponseDTO);
    }

    @PatchMapping("/{id}/cancelar")
    @Operation(summary = "Cancelar pedido")
    public ResponseEntity<PedidoResponseDTO> cancelar(@PathVariable String id) {
        PedidoResponseDTO pedidoResponseDTO = pService.cancelar(id);
        return ResponseEntity.ok(pedidoResponseDTO);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Excluir pedido")
    public ResponseEntity<Void> excluir(@PathVariable String id) {
        pService.excluir(id);
        return ResponseEntity.noContent().build();
    }
}
