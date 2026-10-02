package com.cefet.chamapro.service;

import java.net.URI;
import java.util.ArrayList;
import java.util.List;

import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.util.UriComponentsBuilder;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class GeocodingService {

    private static final String NOMINATIM_URL = "https://nominatim.openstreetmap.org/search";
    private static final String VIACEP_URL = "https://viacep.com.br/ws/";
    private static final long INTERVALO_MS = 1100; // regra do Nominatim: 1 req/s

    private final RestClient restClient;
    private final ObjectMapper objectMapper = new ObjectMapper();
    private long ultimaChamadaNominatim = 0;

    public GeocodingService() {
        // Timeouts: sem eles, uma API fora do ar travaria o cadastro do usuário.
        SimpleClientHttpRequestFactory fabrica = new SimpleClientHttpRequestFactory();
        fabrica.setConnectTimeout(5000);
        fabrica.setReadTimeout(8000);

        this.restClient = RestClient.builder()
                .requestFactory(fabrica)
                // O Nominatim bloqueia requisições sem User-Agent identificável.
                .defaultHeader("User-Agent", "ChamaPro/1.0 (projeto academico CEFET-MG)")
                .build();
    }

    // Devolve {latitude, longitude} ou null se não conseguir.
    public Double[] geocodificar(String rua, Integer numero, String cidade, String cep) {
        List<String> consultas = new ArrayList<>();

        if (!vazio(rua) && !vazio(cidade)) {
            if (numero != null && numero > 0) {
                // Busca mais precisa possível
                consultas.add(rua + ", " + numero + ", " + cidade + ", Minas Gerais, Brasil");
            }
            // Fallback sem o número (muitas ruas no OSM não tem a numeração mapeada)
            consultas.add(rua + ", " + cidade + ", Minas Gerais, Brasil");
        }

        if (!vazio(cidade)) {
            // Fallback para o centro da cidade
            consultas.add(cidade + ", Minas Gerais, Brasil");
        }

        // Remova a busca de "cep + Brasil" para evitar as coordenadas bizarras no RS.

        for (String consulta : consultas) {
            Double[] resultado = buscarNoNominatim(consulta);
            if (resultado != null) {
                return resultado;
            }
        }

        return null;
    }

    // Usado quando só temos o CEP (ex.: usuário trocou o CEP no perfil).
    // O ViaCEP traduz o CEP em rua e cidade, o que dá uma busca bem mais precisa
    // do que mandar só o número do CEP para o Nominatim.
    public Double[] geocodificarPorCep(String cep) {
        if (vazio(cep)) {
            return null;
        }

        String cepLimpo = cep.replaceAll("\\D", "");
        if (cepLimpo.length() != 8) {
            return null;
        }

        try {
            String corpo = restClient.get()
                    .uri(URI.create(VIACEP_URL + cepLimpo + "/json/"))
                    .retrieve()
                    .body(String.class);

            JsonNode raiz = objectMapper.readTree(corpo);

            if (raiz.has("erro")) {
                return geocodificar(null, null, null, cep);
            }

            String rua = textoOuNulo(raiz, "logradouro");
            String cidade = textoOuNulo(raiz, "localidade");
            return geocodificar(rua, null, cidade, cep);
        } catch (Exception e) {
            System.out.println("Erro ao consultar ViaCEP: " + e.getMessage());
            return geocodificar(null, null, null, cep);
        }
    }

    private Double[] buscarNoNominatim(String consulta) {
        try {
            respeitarLimite();

            URI uri = UriComponentsBuilder.fromUriString(NOMINATIM_URL)
                    .queryParam("q", consulta)
                    .queryParam("format", "json")
                    .queryParam("limit", "1")
                    .queryParam("countrycodes", "br")
                    .build()
                    .encode()
                    .toUri();

            String corpo = restClient.get()
                    .uri(uri)
                    .retrieve()
                    .body(String.class);

            JsonNode raiz = objectMapper.readTree(corpo);

            if (raiz.isArray() && raiz.size() > 0) {
                JsonNode primeiro = raiz.get(0);
                Double latitude = Double.valueOf(primeiro.get("lat").asText());
                Double longitude = Double.valueOf(primeiro.get("lon").asText());
                return new Double[] { latitude, longitude };
            }
        } catch (Exception e) {
            System.out.println("Erro ao consultar Nominatim (" + consulta + "): " + e.getMessage());
        }

        return null;
    }

    // synchronized: se dois cadastros acontecerem juntos, as chamadas ao Nominatim
    // entram em fila em vez de estourar o limite.
    private synchronized void respeitarLimite() throws InterruptedException {
        long agora = System.currentTimeMillis();
        long espera = INTERVALO_MS - (agora - ultimaChamadaNominatim);

        if (espera > 0) {
            Thread.sleep(espera);
        }

        ultimaChamadaNominatim = System.currentTimeMillis();
    }

    private boolean vazio(String texto) {
        return texto == null || texto.trim().isEmpty();
    }

    private String textoOuNulo(JsonNode raiz, String campo) {
        JsonNode no = raiz.get(campo);
        if (no == null || no.isNull()) {
            return null;
        }
        return no.asText();
    }
}