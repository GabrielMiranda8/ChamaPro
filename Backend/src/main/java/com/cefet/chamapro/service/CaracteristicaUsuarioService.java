package com.cefet.chamapro.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.cefet.chamapro.dto.CaracteristicaUsuarioRequestDTO;
import com.cefet.chamapro.dto.CaracteristicaUsuarioResponseDTO;
import com.cefet.chamapro.entity.Caracteristica;
import com.cefet.chamapro.entity.CaracteristicaUsuario;
import com.cefet.chamapro.entity.Usuario;
import com.cefet.chamapro.exception.BusinessException;
import com.cefet.chamapro.exception.ResourceNotFoundException;
import com.cefet.chamapro.repository.CaracteristicaRepository;
import com.cefet.chamapro.repository.CaracteristicaUsuarioRepository;
import com.cefet.chamapro.repository.UsuarioRepository;

@Service
public class CaracteristicaUsuarioService {

    @Autowired
    private CaracteristicaUsuarioRepository cuRepository;

    @Autowired
    private CaracteristicaRepository caracteristicaRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Transactional(readOnly = true)
    public List<CaracteristicaUsuarioResponseDTO> listar() {
        List<CaracteristicaUsuario> cus = cuRepository.findAll();
        return cus.stream().map(CaracteristicaUsuarioResponseDTO::new).toList();
    }

    @Transactional(readOnly = true)
    public CaracteristicaUsuarioResponseDTO buscarPorId(String id) {
        CaracteristicaUsuario cu = cuRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("CaracteristicaUsuario não encontrado. Id: " + id));
        return new CaracteristicaUsuarioResponseDTO(cu);
    }

    @Transactional(readOnly = true)
    public List<CaracteristicaUsuarioResponseDTO> listarPorCaracteristica(String idCaracteristica) {
        if (!caracteristicaRepository.existsById(idCaracteristica)) {
            throw new ResourceNotFoundException("Caracteristica não encontrado. Id: " + idCaracteristica);
        }

        return cuRepository.findByCaracteristica_Id(idCaracteristica)
                .stream()
                .map(CaracteristicaUsuarioResponseDTO::new)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<CaracteristicaUsuarioResponseDTO> listarPorUsuario(String idUsuario) {
        if (!usuarioRepository.existsById(idUsuario)) {
            throw new ResourceNotFoundException("Usuário não encontrado. Id: " + idUsuario);
        }

        return cuRepository.findByUsuario_Id(idUsuario)
                .stream()
                .map(CaracteristicaUsuarioResponseDTO::new)
                .toList();
    }

    @Transactional
    public CaracteristicaUsuarioResponseDTO inserir(CaracteristicaUsuarioRequestDTO dto) {

        if (cuRepository.existsByUsuario_IdAndCaracteristica_Id(dto.getIdUsuario(), dto.getIdCaracteristica())) {
            throw new BusinessException("Esse caracteristica já oferece esse serviço.");
        }

        Caracteristica caracteristica = caracteristicaRepository.findById(dto.getIdCaracteristica())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Caracteristica não encontrado. Id: " + dto.getIdCaracteristica()));

        Usuario usuario = usuarioRepository.findById(dto.getIdUsuario())
                .orElseThrow(() -> new ResourceNotFoundException("Serviço não encontrado. Id: " + dto.getIdUsuario()));

        CaracteristicaUsuario cu = new CaracteristicaUsuario();
        cu.setCaracteristica(caracteristica);
        cu.setUsuario(usuario);
        cu.setTem(dto.isTem());
        if (usuario.getTipo() == "CLIENTE")
            cu.setLida(false);
        else
            cu.setLida(dto.isLida());
        return new CaracteristicaUsuarioResponseDTO(cuRepository.save(cu));
    }

    @Transactional
    public CaracteristicaUsuarioResponseDTO atualizar(String id, CaracteristicaUsuarioRequestDTO dto) {
        CaracteristicaUsuario cu = cuRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("CaracteristicaUsuario não encontrado. Id: " + id));

        cu.setTem(dto.isTem());
        cu.setLida(dto.isLida());

        return new CaracteristicaUsuarioResponseDTO(cuRepository.save(cu));
    }

    @Transactional
    public void excluirUsuarioPorCaracteristica(String idCaracteristica, String idUsuario) {
        CaracteristicaUsuario cu = cuRepository.findByCaracteristica_IdAndUsuario_Id(idCaracteristica, idUsuario)
                .orElseThrow(() -> new ResourceNotFoundException("Serviço não encontrado para esse caracteristica."));

        cuRepository.delete(cu);
    }

    @Transactional
    public void excluir(String id) {
        if (!cuRepository.existsById(id)) {
            throw new ResourceNotFoundException("CaracteristicaUsuario não encontrado com ID: " + id);
        }
        cuRepository.deleteById(id);
    }
}