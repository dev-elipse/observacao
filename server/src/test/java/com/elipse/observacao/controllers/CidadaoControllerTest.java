package com.elipse.observacao.controllers;

import com.elipse.observacao.entities.CidadaoEntity;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.elipse.observacao.repositories.CidadaoRepository;
import com.elipse.observacao.services.CidadaoService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import java.lang.reflect.Proxy;
import java.util.*;
import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/** Integra as camadas web, service e mapper com repositorio stub, sem Mockito. */
class CidadaoControllerTest {
    private MockMvc mvc;
    private Map<String, CidadaoEntity> registros;
    private static final String BODY = """
            {"nome":"Ana","email":"ana@example.com","enderecos":[
              {"rua":"Rua A","numero":"10","bairro":"Centro","cidade":"Maringa","estado":"PR"},
              {"rua":"Rua B","numero":"20","bairro":"Zona 2","cidade":"Londrina","estado":"PR"}
            ]}
            """;

    @BeforeEach
    void setUp() {
        registros = new LinkedHashMap<>();
        CidadaoRepository repository = (CidadaoRepository) Proxy.newProxyInstance(
                CidadaoRepository.class.getClassLoader(), new Class<?>[]{CidadaoRepository.class},
                (proxy, method, args) -> switch (method.getName()) {
                    case "findAll" -> new ArrayList<>(registros.values());
                    case "findById" -> Optional.ofNullable(registros.get(args[0]))
                            .map(entity -> new ObjectMapper().convertValue(entity, CidadaoEntity.class));
                    case "existsById" -> registros.containsKey(args[0]);
                    case "deleteById" -> { registros.remove(args[0]); yield null; }
                    case "save" -> {
                        CidadaoEntity entity = (CidadaoEntity) args[0];
                        if (registros.values().stream().anyMatch(other ->
                                !other.getId().equals(entity.getId()) && other.getEmail().equals(entity.getEmail()))) {
                            throw new DuplicateKeyException("email duplicado");
                        }
                        registros.put(entity.getId(), entity);
                        yield entity;
                    }
                    default -> throw new UnsupportedOperationException(method.getName());
                });
        mvc = MockMvcBuilders.standaloneSetup(new CidadaoController(new CidadaoService(repository))).build();
    }

    private String criar() throws Exception {
        mvc.perform(post("/api/cidadaos").contentType(MediaType.APPLICATION_JSON).content(BODY))
                .andExpect(status().isCreated()).andExpect(header().exists("Location"))
                .andExpect(jsonPath("$.id").isNotEmpty()).andExpect(jsonPath("$.nome").value("Ana"))
                .andExpect(jsonPath("$.email").value("ana@example.com"))
                .andExpect(jsonPath("$.enderecos.length()").value(2))
                .andExpect(jsonPath("$.enderecos[0].numero").value("10"))
                .andExpect(jsonPath("$.enderecos[1].cidade").value("Londrina"));
        return registros.keySet().iterator().next();
    }

    @Test
    void deveExecutarCrudComEnderecosEmbutidos() throws Exception {
        mvc.perform(get("/api/cidadaos")).andExpect(jsonPath("$.length()").value(0));
        String id = criar();
        mvc.perform(get("/api/cidadaos")).andExpect(status().isOk()).andExpect(jsonPath("$[0].id").value(id));
        mvc.perform(get("/api/cidadaos/{id}", id)).andExpect(status().isOk())
                .andExpect(jsonPath("$.enderecos[0].rua").value("Rua A"));
        mvc.perform(put("/api/cidadaos/{id}", id).contentType(MediaType.APPLICATION_JSON)
                        .content(BODY.replace("Ana", "Ana Silva").replace("Rua A", "Rua Nova")))
                .andExpect(status().isOk()).andExpect(jsonPath("$.id").value(id))
                .andExpect(jsonPath("$.nome").value("Ana Silva"))
                .andExpect(jsonPath("$.enderecos[0].rua").value("Rua Nova"));
        mvc.perform(delete("/api/cidadaos/{id}", id)).andExpect(status().isNoContent());
        assertThat(registros).isEmpty();
    }

    @Test
    void deveRetornar404ParaCidadaoInexistente() throws Exception {
        mvc.perform(get("/api/cidadaos/ausente")).andExpect(status().isNotFound());
        mvc.perform(put("/api/cidadaos/ausente").contentType(MediaType.APPLICATION_JSON).content(BODY))
                .andExpect(status().isNotFound());
        mvc.perform(delete("/api/cidadaos/ausente")).andExpect(status().isNotFound());
        assertThat(registros).isEmpty();
    }

    @Test
    void deveRetornar409ParaEmailDuplicado() throws Exception {
        criar();
        mvc.perform(post("/api/cidadaos").contentType(MediaType.APPLICATION_JSON).content(BODY))
                .andExpect(status().isConflict());
        mvc.perform(post("/api/cidadaos").contentType(MediaType.APPLICATION_JSON)
                        .content(BODY.replace("ana@example.com", "outro@example.com")))
                .andExpect(status().isCreated());
        String outroId = registros.values().stream().filter(e -> e.getEmail().equals("outro@example.com"))
                .findFirst().orElseThrow().getId();
        mvc.perform(put("/api/cidadaos/{id}", outroId).contentType(MediaType.APPLICATION_JSON).content(BODY))
                .andExpect(status().isConflict());
        assertThat(registros).hasSize(2);
        assertThat(registros.get(outroId).getEmail()).isEqualTo("outro@example.com");
    }

    @Test
    void deveValidarCamposEEnderecosNaCriacaoEAtualizacao() throws Exception {
        for (String json : List.of("{}", BODY.replace("Ana", " "),
                BODY.replace("ana@example.com", "invalido"), BODY.replace("ana@example.com", " "),
                BODY.replace("Rua A", ""), BODY.replace("Maringa", ""), BODY.replace("PR", "PARANA"),
                BODY.replace("10", ""), BODY.replace("Centro", ""))) {
            mvc.perform(post("/api/cidadaos").contentType(MediaType.APPLICATION_JSON).content(json))
                    .andExpect(status().isBadRequest());
            mvc.perform(put("/api/cidadaos/id").contentType(MediaType.APPLICATION_JSON).content(json))
                    .andExpect(status().isBadRequest());
        }
        assertThat(registros).isEmpty();
    }

    @Test
    void deveAceitarListaVaziaERemoverEnderecosNaAtualizacao() throws Exception {
        String id = criar();
        String json = """
                {"nome":"Ana","email":"ana@example.com","enderecos":[]}
                """;
        mvc.perform(put("/api/cidadaos/{id}", id).contentType(MediaType.APPLICATION_JSON).content(json))
                .andExpect(status().isOk()).andExpect(jsonPath("$.enderecos").isEmpty());
        assertThat(registros.get(id).getEnderecos()).isEmpty();
        for (String invalid : List.of(json.replace("[]", "null"), json.replace("[]", "[null]"))) {
            mvc.perform(post("/api/cidadaos").contentType(MediaType.APPLICATION_JSON).content(invalid))
                    .andExpect(status().isBadRequest());
        }
    }
}
