package com.cefet.chamapro.service;

import java.io.IOException;
import java.util.Map;
import java.util.Set;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;
import org.springframework.web.multipart.MultipartFile;

import com.cefet.chamapro.exception.BusinessException;

/**
 * Envia imagens ao Cloudinary usando upload "unsigned" (upload_preset),
 * o mesmo que o front já usa. Não precisa de API secret.
 */
@Service
public class CloudinaryService {

    private static final Set<String> TIPOS_PERMITIDOS = Set.of("image/jpeg", "image/png", "image/webp");

    private final RestClient restClient = RestClient.create();

    @Value("${cloudinary.cloud-name:roumjjzl}")
    private String cloudName;

    @Value("${cloudinary.upload-preset:chamapro_perfil}")
    private String uploadPreset;

    @Value("${cloudinary.folder:chamapro/perfil}")
    private String folder;

    /** Valida o arquivo, envia ao Cloudinary e devolve a URL https final. */
    @SuppressWarnings("unchecked")
    public String enviarImagem(MultipartFile arquivo) {
        if (arquivo == null || arquivo.isEmpty()) {
            throw new IllegalArgumentException("Arquivo é obrigatório");
        }
        if (arquivo.getContentType() == null || !TIPOS_PERMITIDOS.contains(arquivo.getContentType())) {
            throw new IllegalArgumentException("Tipo de arquivo inválido. Envie uma imagem JPEG, PNG ou WEBP");
        }

        byte[] bytes;
        try {
            bytes = arquivo.getBytes();
        } catch (IOException e) {
            throw new IllegalArgumentException("Não foi possível ler o arquivo enviado");
        }

        final String nomeOriginal = arquivo.getOriginalFilename() != null ? arquivo.getOriginalFilename() : "foto";
        // O Cloudinary precisa de um filename na parte "file" do multipart
        ByteArrayResource recurso = new ByteArrayResource(bytes) {
            @Override
            public String getFilename() {
                return nomeOriginal;
            }
        };
        MultiValueMap<String, Object> form = new LinkedMultiValueMap<>();
        form.add("file", recurso);
        form.add("upload_preset", uploadPreset);
        form.add("folder", folder);

        try {
            Map<String, Object> resposta = restClient.post()
                    .uri("https://api.cloudinary.com/v1_1/" + cloudName + "/image/upload")
                    .contentType(MediaType.MULTIPART_FORM_DATA)
                    .body(form)
                    .retrieve()
                    .body(Map.class);

            Object url = resposta != null ? resposta.get("secure_url") : null;
            if (url == null) {
                throw new BusinessException("O Cloudinary não retornou a URL da imagem");
            }
            return url.toString();
        } catch (RestClientException e) {
            throw new BusinessException("Falha ao enviar a imagem ao Cloudinary: " + e.getMessage());
        }
    }
}
