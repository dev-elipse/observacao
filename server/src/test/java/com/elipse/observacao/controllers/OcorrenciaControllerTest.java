package com.elipse.observacao.controllers;

import com.elipse.observacao.dtos.EnderecoDTO;
import com.elipse.observacao.dtos.OcorrenciaCreateDTO;
import com.elipse.observacao.dtos.OcorrenciaResponseDTO;
import com.elipse.observacao.enums.CategoriaOcorrencia;
import com.elipse.observacao.enums.PrioridadeOcorrencia;
import com.elipse.observacao.enums.StatusOcorrencia;
import com.elipse.observacao.exceptions.EntityNotFoundException;
import com.elipse.observacao.services.OcorrenciaService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Bean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.OffsetDateTime;
import java.util.List;

import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(OcorrenciaController.class)
class OcorrenciaControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

        @Autowired
        private StubOcorrenciaService ocorrenciaService;

        @BeforeEach
        void resetServiceStub() {
                ocorrenciaService.reset();
        }

        @TestConfiguration
        static class TestConfig {
                @Bean
                StubOcorrenciaService ocorrenciaService() {
                        return new StubOcorrenciaService();
                }
        }

    private OcorrenciaCreateDTO buildCreateDTO() {
        EnderecoDTO endereco = new EnderecoDTO();
        endereco.setRua("Rua das Flores");
        endereco.setNumero("120");
        endereco.setBairro("Centro");

        OcorrenciaCreateDTO dto = new OcorrenciaCreateDTO();
        dto.setTitulo("Buraco na via");
        dto.setDescricao("Buraco grande próximo ao número 120.");
        dto.setCategoria(CategoriaOcorrencia.INFRAESTRUTURA);
        dto.setEndereco(endereco);
        dto.setPrioridade(PrioridadeOcorrencia.ALTA);
        dto.setStatus(StatusOcorrencia.ABERTA);
        return dto;
    }

    private OcorrenciaResponseDTO buildResponseDTO() {
        EnderecoDTO endereco = new EnderecoDTO();
        endereco.setRua("Rua das Flores");
        endereco.setNumero("120");
        endereco.setBairro("Centro");

        OcorrenciaResponseDTO dto = new OcorrenciaResponseDTO();
        dto.setId("ocr-01");
        dto.setTitulo("Buraco na via");
        dto.setDescricao("Buraco grande próximo ao número 120.");
        dto.setCategoria(CategoriaOcorrencia.INFRAESTRUTURA);
        dto.setEndereco(endereco);
        dto.setPrioridade(PrioridadeOcorrencia.ALTA);
        dto.setStatus(StatusOcorrencia.ABERTA);
        dto.setCreatedAt(OffsetDateTime.now());
        dto.setUpdatedAt(OffsetDateTime.now());
        return dto;
    }

    @Test
    void deveCriarOcorrenciaERetornar201() throws Exception {
                ocorrenciaService.createResult = buildResponseDTO();

        mockMvc.perform(post("/api/ocorrencias")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(buildCreateDTO())))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value("ocr-01"))
                .andExpect(jsonPath("$.categoria").value("INFRAESTRUTURA"))
                .andExpect(jsonPath("$.endereco.bairro").value("Centro"));
    }

    @Test
    void deveRejeitarCriacaoComCamposObrigatoriosAusentes() throws Exception {
        OcorrenciaCreateDTO dto = new OcorrenciaCreateDTO();

        mockMvc.perform(post("/api/ocorrencias")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void deveListarTodasAsOcorrencias() throws Exception {
                ocorrenciaService.findAllResult = List.of(buildResponseDTO());

        mockMvc.perform(get("/api/ocorrencias"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].id").value("ocr-01"));
    }

    @Test
    void deveBuscarOcorrenciaPorIdComSucesso() throws Exception {
                ocorrenciaService.findByIdResult = buildResponseDTO();

        mockMvc.perform(get("/api/ocorrencias/{id}", "ocr-01"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.titulo").value("Buraco na via"));
    }

    @Test
    void deveRetornar404QuandoOcorrenciaNaoExistir() throws Exception {
                ocorrenciaService.findByIdException = new EntityNotFoundException("ocorrencia not found");

        mockMvc.perform(get("/api/ocorrencias/{id}", "inexistente"))
                .andExpect(status().isNotFound());
    }

    @Test
    void deveAtualizarOcorrenciaComSucesso() throws Exception {
                ocorrenciaService.updateResult = buildResponseDTO();

        mockMvc.perform(put("/api/ocorrencias/{id}", "ocr-01")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(buildCreateDTO())))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value("ocr-01"));
    }

    @Test
    void deveRetornar404AoAtualizarOcorrenciaInexistente() throws Exception {
                ocorrenciaService.updateException = new EntityNotFoundException("ocorrencia not found");

        mockMvc.perform(put("/api/ocorrencias/{id}", "inexistente")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(buildCreateDTO())))
                .andExpect(status().isNotFound());
    }

    @Test
    void deveExcluirOcorrenciaComSucesso() throws Exception {
        mockMvc.perform(delete("/api/ocorrencias/{id}", "ocr-01"))
                .andExpect(status().isNoContent());
    }

    @Test
    void deveRetornar404AoExcluirOcorrenciaInexistente() throws Exception {
                ocorrenciaService.deleteException = new EntityNotFoundException("ocorrencia not found");

        mockMvc.perform(delete("/api/ocorrencias/{id}", "inexistente"))
                .andExpect(status().isNotFound());
    }

        static class StubOcorrenciaService extends OcorrenciaService {
                private OcorrenciaResponseDTO createResult;
                private List<OcorrenciaResponseDTO> findAllResult = List.of();
                private OcorrenciaResponseDTO findByIdResult;
                private EntityNotFoundException findByIdException;
                private OcorrenciaResponseDTO updateResult;
                private EntityNotFoundException updateException;
                private EntityNotFoundException deleteException;

                StubOcorrenciaService() {
                        super(null);
                }

                void reset() {
                        createResult = null;
                        findAllResult = List.of();
                        findByIdResult = null;
                        findByIdException = null;
                        updateResult = null;
                        updateException = null;
                        deleteException = null;
                }

                @Override
                public OcorrenciaResponseDTO create(OcorrenciaCreateDTO dto) {
                        return createResult;
                }d

                @Override
                public List<OcorrenciaResponseDTO> findAll() {
                        return findAllResult;
                }

                @Override
                public OcorrenciaResponseDTO findById(String id) {
                        if (findByIdException != null) {
                                throw findByIdException;
                        }
                        return findByIdResult;
                }

                @Override
                public OcorrenciaResponseDTO update(String id, OcorrenciaCreateDTO dto) {
                        if (updateException != null) {
                                throw updateException;
                        }
                        return updateResult;
                }

                @Override
                public void delete(String id) {
                        if (deleteException != null) {
                                throw deleteException;
                        }
                }
        }
}
