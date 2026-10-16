package com.cefet.chamapro.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.cefet.chamapro.entity.Arquivo;
import com.cefet.chamapro.exception.ResourceNotFoundException;
import com.cefet.chamapro.repository.ArquivoRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ArquivoService {

    private final ArquivoRepository repository;
    private final CloudinaryService cloudinaryService;

    /** Valida e envia o arquivo ao Cloudinary (via CloudinaryService) e registra os dados no banco. */
    public Arquivo salvar(MultipartFile arquivo) {
        String url = cloudinaryService.enviarImagem(arquivo);

        Arquivo entidade = new Arquivo();
        entidade.setNomeOriginal(arquivo.getOriginalFilename() != null ? arquivo.getOriginalFilename() : "arquivo");
        entidade.setTipo(arquivo.getContentType());
        entidade.setTamanho(arquivo.getSize());
        entidade.setUrl(url);

        return repository.save(entidade);
    }

    public List<Arquivo> listar() {
        return repository.findAll();
    }

    public Arquivo buscarPorId(String id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Arquivo não encontrado"));
    }

    /** Remove o registro do banco. O upload "unsigned" não permite apagar a imagem no Cloudinary. */
    public void excluir(String id) {
        repository.delete(buscarPorId(id));
    }
}