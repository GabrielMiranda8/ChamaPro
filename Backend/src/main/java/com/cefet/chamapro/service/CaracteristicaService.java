package com.cefet.chamapro.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.cefet.chamapro.dto.CaracteristicaRequestDTO;
import com.cefet.chamapro.dto.CaracteristicaResponseDTO;
import com.cefet.chamapro.entity.Caracteristica;
import com.cefet.chamapro.exception.BusinessException;
import com.cefet.chamapro.exception.ResourceNotFoundException;
import com.cefet.chamapro.repository.CaracteristicaRepository;

@Service
public class CaracteristicaService {

    @Autowired
    private CaracteristicaRepository caracteristicaRepository;

    @Transactional(readOnly = true)
    public List<CaracteristicaResponseDTO> listar() {
        List<Caracteristica> caracteristicas = caracteristicaRepository.findAll();
        return caracteristicas.stream().map(CaracteristicaResponseDTO::new).toList();
    }

    @Transactional(readOnly = true)
    public CaracteristicaResponseDTO buscarPorId(String id) {
    	Caracteristica caracteristica = caracteristicaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Caracteristica não encontrada. Id: " + id));

        return new CaracteristicaResponseDTO(caracteristica);
    }

    @Transactional
    public CaracteristicaResponseDTO inserir(CaracteristicaRequestDTO dto) {

    	if (caracteristicaRepository.existsByNome(dto.getNome())) {
            throw new BusinessException("Já existe uma característica com esse nome.");
        }

    	Caracteristica caracteristica = new Caracteristica();
    	caracteristica.setNome(dto.getNome());
        caracteristica.setDescricao(dto.getDescricao());

        return new CaracteristicaResponseDTO(caracteristicaRepository.save(caracteristica));
    }

    @Transactional
    public CaracteristicaResponseDTO atualizar(String id, CaracteristicaRequestDTO dto) {

    	Caracteristica caracteristica = caracteristicaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Caracteristica não encontrada. Id: " + id));

    	if (caracteristicaRepository.existsByNomeAndIdNot(dto.getNome(), id)) {
            throw new BusinessException("Já existe uma característica com esse nome.");
        }

    	caracteristica.setNome(dto.getNome());
        caracteristica.setDescricao(dto.getDescricao());

        return new CaracteristicaResponseDTO(caracteristicaRepository.save(caracteristica));
    }

    @Transactional
    public void excluir(String id) {
        if (!caracteristicaRepository.existsById(id)) {
            throw new ResourceNotFoundException("Caracteristica não encontrada com ID: " + id);
        }
        caracteristicaRepository.deleteById(id);
    }
}