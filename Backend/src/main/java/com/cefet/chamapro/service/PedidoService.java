package com.cefet.chamapro.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.cefet.chamapro.dto.PedidoRequestDTO;
import com.cefet.chamapro.dto.PedidoResponseDTO;
import com.cefet.chamapro.entity.Profissional;
import com.cefet.chamapro.entity.Servico;
import com.cefet.chamapro.entity.Status;
import com.cefet.chamapro.entity.Pedido;
import com.cefet.chamapro.entity.Cliente;
import com.cefet.chamapro.entity.Endereco;
import com.cefet.chamapro.exception.BusinessException;
import com.cefet.chamapro.exception.ResourceNotFoundException;
import com.cefet.chamapro.repository.ProfissionalRepository;
import com.cefet.chamapro.repository.ServicoRepository;
import com.cefet.chamapro.repository.PedidoRepository;
import com.cefet.chamapro.repository.ClienteRepository;
import com.cefet.chamapro.repository.EnderecoRepository;

@Service
public class PedidoService {

    @Autowired
    private PedidoRepository pRepository;

    @Autowired
    private ProfissionalRepository profissionalRepository;

    @Autowired
    private ClienteRepository clienteRepository;

    @Autowired
    private ServicoRepository servicoRepository;

    @Autowired
    private EnderecoRepository enderecoRepository;

    @Transactional(readOnly = true)
    public List<PedidoResponseDTO> listar() {
        List<Pedido> ps = pRepository.findAll();
        return ps.stream().map(PedidoResponseDTO::new).toList();
    }

    @Transactional(readOnly = true)
    public PedidoResponseDTO buscarPorId(String id) {
        Pedido p = pRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Pedido não encontrado. Id: " + id));
        return new PedidoResponseDTO(p);
    }

    @Transactional(readOnly = true)
    public List<PedidoResponseDTO> listarPorProfissional(String idProfissional) {
        if (!profissionalRepository.existsById(idProfissional)) {
            throw new ResourceNotFoundException("Profissional não encontrado. Id: " + idProfissional);
        }

        return pRepository.findByProfissional_Id(idProfissional)
                .stream()
                .map(PedidoResponseDTO::new)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<PedidoResponseDTO> listarPorCliente(String idCliente) {
        if (!clienteRepository.existsById(idCliente)) {
            throw new ResourceNotFoundException("Usuário não encontrado. Id: " + idCliente);
        }

        return pRepository.findByCliente_Id(idCliente)
                .stream()
                .map(PedidoResponseDTO::new)
                .toList();
    }

    @Transactional
    public List<PedidoResponseDTO> listarPorUsuario(String idUsuario) {
        if (!clienteRepository.existsById(idUsuario) && !profissionalRepository.existsById(idUsuario)) {
            throw new ResourceNotFoundException("Usuário não encontrado. Id: " + idUsuario);
        }

        List<Pedido> pedidos = pRepository.findByCliente_Id(idUsuario);
        pedidos.addAll(pRepository.findByProfissional_Id(idUsuario));

        return pedidos.stream()
                .map(PedidoResponseDTO::new)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<PedidoResponseDTO> listarPorServico(String idServico) {
        if (!servicoRepository.existsById(idServico)) {
            throw new ResourceNotFoundException("Serviço não encontrado. Id: " + idServico);
        }

        return pRepository.findByServico_Id(idServico)
                .stream()
                .map(PedidoResponseDTO::new)
                .toList();
    }

    @Transactional
    public PedidoResponseDTO inserir(PedidoRequestDTO dto) {

        Profissional profissional = profissionalRepository.findById(dto.getIdProfissional())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Profissional não encontrado. Id: " + dto.getIdProfissional()));

        Cliente cliente = clienteRepository.findById(dto.getIdCliente())
                .orElseThrow(() -> new ResourceNotFoundException("Cliente não encontrado. Id: " + dto.getIdCliente()));

        Servico servico = servicoRepository.findById(dto.getIdServico())
                .orElseThrow(() -> new ResourceNotFoundException("Serviço não encontrado. Id: " + dto.getIdServico()));

        Endereco endereco = enderecoRepository.findById(dto.getIdEndereco())
                .orElseThrow(
                        () -> new ResourceNotFoundException("Endereço não encontrado. Id: " + dto.getIdEndereco()));

        Pedido p = new Pedido();
        p.setProfissional(profissional);
        p.setCliente(cliente);
        p.setServico(servico);
        p.setEndereco(endereco);
        p.setPreco(dto.getPreco());
        //p.setData(dto.getData());
        p.setDescricao(dto.getDescricao());
        p.setStatus(Status.PENDENTE);

        return new PedidoResponseDTO(pRepository.save(p));
    }

    @Transactional
    public PedidoResponseDTO atualizar(String id, PedidoRequestDTO dto) {
        Pedido p = pRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Pedido não encontrado. Id: " + id));

        Endereco endereco = enderecoRepository.findById(dto.getIdEndereco())
                .orElseThrow(
                        () -> new ResourceNotFoundException("Endereço não encontrado. Id: " + dto.getIdEndereco()));

        p.setPreco(dto.getPreco());
        p.setData(dto.getData());
        p.setEndereco(endereco);
        p.setDescricao(dto.getDescricao());

        return new PedidoResponseDTO(pRepository.save(p));
    }

    @Transactional
    public void excluir(String id) {
        if (!pRepository.existsById(id)) {
            throw new ResourceNotFoundException("Pedido não encontrado com ID: " + id);
        }
        pRepository.deleteById(id);
    }

    @Transactional
    public PedidoResponseDTO atualizarStatus(String id) {
        Pedido p = pRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Pedido não encontrado. Id: " + id));

        if (p.getStatus() == Status.FINALIZADO) {
            throw new BusinessException("O pedido já está concluído e não pode ser atualizado.");
        }

        if (p.getStatus() == Status.PENDENTE) {
            p.setStatus(Status.ACEITO);
        } else if (p.getStatus() == Status.ACEITO) {
            p.setStatus(Status.EM_ANDAMENTO);
        } else if (p.getStatus() == Status.EM_ANDAMENTO) {
            p.setStatus(Status.FINALIZADO);
        }

        return new PedidoResponseDTO(pRepository.save(p));
    }

    @Transactional
    public PedidoResponseDTO recusar(String id) {
        Pedido p = pRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Pedido não encontrado. Id: " + id));

        if (p.getStatus() != Status.PENDENTE) {
            throw new BusinessException("Só é possível recusar um pedido que ainda está pendente.");
        }

        p.setStatus(Status.RECUSADO);
        return new PedidoResponseDTO(pRepository.save(p));
    }

    @Transactional
    public PedidoResponseDTO cancelar(String id) {
        Pedido p = pRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Pedido não encontrado. Id: " + id));

        if (p.getStatus() == Status.FINALIZADO || p.getStatus() == Status.CANCELADO
                || p.getStatus() == Status.RECUSADO) {
            throw new BusinessException("Esse pedido não pode mais ser cancelado.");
        }

        p.setStatus(Status.CANCELADO);
        return new PedidoResponseDTO(pRepository.save(p));
    }

}