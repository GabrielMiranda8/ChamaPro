package com.cefet.chamapro.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.cefet.chamapro.dto.EnderecoRequestDTO;
import com.cefet.chamapro.dto.EnderecoResponseDTO;
import com.cefet.chamapro.entity.Endereco;
import com.cefet.chamapro.entity.Usuario;
import com.cefet.chamapro.exception.BusinessException;
import com.cefet.chamapro.exception.ResourceNotFoundException;
import com.cefet.chamapro.repository.EnderecoRepository;
import com.cefet.chamapro.repository.UsuarioRepository;

@Service
public class EnderecoService {
    @Autowired
    private EnderecoRepository enderecoRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private GeocodingService geocodingService;

    @Transactional(readOnly = true)
    public List<EnderecoResponseDTO> listar() {
        List<Endereco> enderecos = enderecoRepository.findAll();
        return enderecos.stream().map(EnderecoResponseDTO::new).toList();
    }

    @Transactional(readOnly = true)
    public EnderecoResponseDTO buscarPorId(String id) {
        Endereco endereco = enderecoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Endereco não encontrado. Id: " + id));

        return new EnderecoResponseDTO(endereco);
    }

    @Transactional(readOnly = true)
    public List<EnderecoResponseDTO> listarPorUsuario(String idUsuario) {
        if (!usuarioRepository.existsById(idUsuario)) {
            throw new ResourceNotFoundException("Usuário não encontrado. Id: " + idUsuario);
        }

        List<Endereco> enderecos = enderecoRepository.findByUsuario_Id(idUsuario);
        return enderecos.stream().map(EnderecoResponseDTO::new).toList();
    }

    @Transactional
    public EnderecoResponseDTO inserir(EnderecoRequestDTO dto) {

        Usuario usuario = usuarioRepository.findById(dto.getIdUsuario())
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado. Id: " + dto.getIdUsuario()));

        Endereco endereco = new Endereco();
        endereco.setCep(dto.getCep());
        endereco.setBairro(dto.getBairro());
        endereco.setCidade(dto.getCidade());
        endereco.setComplemento(dto.getComplemento());
        endereco.setNumero(dto.getNumero());
        endereco.setReferencia(dto.getReferencia());
        endereco.setRua(dto.getRua());
        endereco.setUsuario(usuario);

        Double[] coordenadas = geocodingService.geocodificar(
                dto.getRua(), dto.getNumero(), dto.getCidade(), dto.getCep());
        aplicarCoordenadas(endereco, coordenadas);

        return new EnderecoResponseDTO(enderecoRepository.save(endereco));
    }

    @Transactional
    public EnderecoResponseDTO atualizar(String id, EnderecoRequestDTO dto) {

        Endereco endereco = enderecoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Endereco não encontrado. Id: " + id));

        endereco.setCep(dto.getCep());
        endereco.setRua(dto.getRua());
        endereco.setNumero(dto.getNumero());
        endereco.setBairro(dto.getBairro());
        endereco.setCidade(dto.getCidade());
        endereco.setComplemento(dto.getComplemento());
        endereco.setReferencia(dto.getReferencia());

        // CORREÇÃO: Use o geocodificar completo em vez de geocodificarPorCep
        Double[] coordenadas = geocodingService.geocodificar(
                dto.getRua(), dto.getNumero(), dto.getCidade(), dto.getCep());
                
        aplicarCoordenadas(endereco, coordenadas);

        return new EnderecoResponseDTO(enderecoRepository.save(endereco));
    }

    @Transactional
    public void excluir(String id) {
        if (!enderecoRepository.existsById(id)) {
            throw new ResourceNotFoundException("Endereco não encontrado com ID: " + id);
        }
        enderecoRepository.deleteById(id);
    }

    // Se a geocodificação falhou (c == null), zera as coordenadas de propósito:
    // coordenada antiga de um endereço que mudou seria pior do que nenhuma.
    private void aplicarCoordenadas(Endereco endereco, Double[] coordenadas) {
        if (coordenadas == null) {
            endereco.setLatitude(null);
            endereco.setLongitude(null);
        } else {
            endereco.setLatitude(coordenadas[0]);
            endereco.setLongitude(coordenadas[1]);
        }
    }

    // APAGAR DEPOIS
    // Geocodifica todos os endereços que ainda não têm coordenadas.
// Sem @Transactional de propósito: cada save() é uma transação curta,
// em vez de segurar uma conexão aberta durante várias chamadas externas.
public int geocodificarPendentes() {
    List<Endereco> pendentes = enderecoRepository.findByLatitudeIsNull();
    int total = 0;

    for (Endereco endereco : pendentes) {
        Double[] coordenadas = geocodingService.geocodificar(
                endereco.getRua(), endereco.getNumero(), endereco.getCidade(), endereco.getCep());

        if (coordenadas != null) {
            aplicarCoordenadas(endereco, coordenadas);
            enderecoRepository.save(endereco);
            total++;
        }
    }

    return total;
}
}
