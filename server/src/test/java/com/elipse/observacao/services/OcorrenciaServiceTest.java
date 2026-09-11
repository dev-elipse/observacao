package com.elipse.observacao.services;

import com.elipse.observacao.dtos.EnderecoDTO;
import com.elipse.observacao.dtos.OcorrenciaCreateDTO;
import com.elipse.observacao.dtos.OcorrenciaResponseDTO;
import com.elipse.observacao.entities.Endereco;
import com.elipse.observacao.entities.OcorrenciaEntity;
import com.elipse.observacao.enums.CategoriaOcorrencia;
import com.elipse.observacao.enums.PrioridadeOcorrencia;
import com.elipse.observacao.enums.StatusOcorrencia;
import com.elipse.observacao.exceptions.EntityNotFoundException;
import com.elipse.observacao.repositories.OcorrenciaRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.lang.reflect.Proxy;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class OcorrenciaServiceTest {

    private OcorrenciaRepository ocorrenciaRepository;

    private OcorrenciaService ocorrenciaService;
    private RepositoryStub repositoryStub;

    private OcorrenciaCreateDTO createDTO;
    private OcorrenciaEntity entity;

    @BeforeEach
    void setUp() {
        repositoryStub = new RepositoryStub();
        ocorrenciaRepository = repositoryStub.createProxy();
        ocorrenciaService = new OcorrenciaService(ocorrenciaRepository);

        EnderecoDTO enderecoDTO = new EnderecoDTO();
        enderecoDTO.setRua("Rua das Flores");
        enderecoDTO.setNumero("120");
        enderecoDTO.setBairro("Centro");

        createDTO = new OcorrenciaCreateDTO();
        createDTO.setTitulo("Buraco na via");
        createDTO.setDescricao("Buraco grande próximo ao número 120.");
        createDTO.setCategoria(CategoriaOcorrencia.INFRAESTRUTURA);
        createDTO.setEndereco(enderecoDTO);
        createDTO.setPrioridade(PrioridadeOcorrencia.ALTA);
        createDTO.setStatus(StatusOcorrencia.ABERTA);

        Endereco endereco = new Endereco("Rua das Flores", "120", "Centro");

        entity = new OcorrenciaEntity();
        entity.setId("ocr-01");
        entity.setTitulo("Buraco na via");
        entity.setDescricao("Buraco grande próximo ao número 120.");
        entity.setCategoria(CategoriaOcorrencia.INFRAESTRUTURA);
        entity.setEndereco(endereco);
        entity.setPrioridade(PrioridadeOcorrencia.ALTA);
        entity.setStatus(StatusOcorrencia.ABERTA);
    }

    @Test
    void deveCriarOcorrenciaComSucesso() {
        repositoryStub.savedEntity = entity;

        OcorrenciaResponseDTO response = ocorrenciaService.create(createDTO);

        assertThat(response).isNotNull();
        assertThat(response.getId()).isEqualTo("ocr-01");
        assertThat(response.getTitulo()).isEqualTo("Buraco na via");
        assertThat(response.getCategoria()).isEqualTo(CategoriaOcorrencia.INFRAESTRUTURA);
        assertThat(response.getEndereco().getBairro()).isEqualTo("Centro");
        assertThat(repositoryStub.saveCalls).isEqualTo(1);
    }

    @Test
    void deveListarTodasAsOcorrencias() {
        repositoryStub.findAllResult = List.of(entity);

        List<OcorrenciaResponseDTO> response = ocorrenciaService.findAll();

        assertThat(response).hasSize(1);
        assertThat(response.get(0).getId()).isEqualTo("ocr-01");
    }

    @Test
    void deveRetornarListaVaziaQuandoNaoHouverOcorrencias() {
        repositoryStub.findAllResult = List.of();

        List<OcorrenciaResponseDTO> response = ocorrenciaService.findAll();

        assertThat(response).isEmpty();
    }

    @Test
    void deveBuscarOcorrenciaPorId() {
        repositoryStub.findByIdResult = Optional.of(entity);

        OcorrenciaResponseDTO response = ocorrenciaService.findById("ocr-01");

        assertThat(response.getId()).isEqualTo("ocr-01");
        assertThat(response.getStatus()).isEqualTo(StatusOcorrencia.ABERTA);
    }

    @Test
    void deveLancarExcecaoQuandoOcorrenciaNaoEncontradaPorId() {
        repositoryStub.findByIdResult = Optional.empty();

        assertThatThrownBy(() -> ocorrenciaService.findById("inexistente"))
                .isInstanceOf(EntityNotFoundException.class);
    }

    @Test
    void deveAtualizarOcorrenciaComSucesso() {
        EnderecoDTO novoEndereco = new EnderecoDTO();
        novoEndereco.setRua("Avenida Central");
        novoEndereco.setNumero("45");
        novoEndereco.setBairro("Jardim América");

        OcorrenciaCreateDTO updateDTO = new OcorrenciaCreateDTO();
        updateDTO.setTitulo("Buraco reparado parcialmente");
        updateDTO.setDescricao("Equipe já iniciou o reparo.");
        updateDTO.setCategoria(CategoriaOcorrencia.INFRAESTRUTURA);
        updateDTO.setEndereco(novoEndereco);
        updateDTO.setPrioridade(PrioridadeOcorrencia.MEDIA);
        updateDTO.setStatus(StatusOcorrencia.EM_ATENDIMENTO);

        repositoryStub.findByIdResult = Optional.of(entity);
        repositoryStub.saveReturnsArgument = true;

        OcorrenciaResponseDTO response = ocorrenciaService.update("ocr-01", updateDTO);

        assertThat(response.getStatus()).isEqualTo(StatusOcorrencia.EM_ATENDIMENTO);
        assertThat(response.getPrioridade()).isEqualTo(PrioridadeOcorrencia.MEDIA);
        assertThat(response.getEndereco().getRua()).isEqualTo("Avenida Central");
        assertThat(response.getUpdatedAt()).isNotNull();
    }

    @Test
    void deveLancarExcecaoAoAtualizarOcorrenciaInexistente() {
        repositoryStub.findByIdResult = Optional.empty();

        assertThatThrownBy(() -> ocorrenciaService.update("inexistente", createDTO))
                .isInstanceOf(EntityNotFoundException.class);

        assertThat(repositoryStub.saveCalls).isZero();
    }

    @Test
    void deveExcluirOcorrenciaComSucesso() {
        repositoryStub.existsByIdResult = true;

        ocorrenciaService.delete("ocr-01");

        assertThat(repositoryStub.deletedId).isEqualTo("ocr-01");
    }

    @Test
    void deveLancarExcecaoAoExcluirOcorrenciaInexistente() {
        repositoryStub.existsByIdResult = false;

        assertThatThrownBy(() -> ocorrenciaService.delete("inexistente"))
                .isInstanceOf(EntityNotFoundException.class);

        assertThat(repositoryStub.deletedId).isNull();
    }

    private static final class RepositoryStub {
        private List<OcorrenciaEntity> findAllResult = List.of();
        private Optional<OcorrenciaEntity> findByIdResult = Optional.empty();
        private OcorrenciaEntity savedEntity;
        private boolean saveReturnsArgument;
        private boolean existsByIdResult;
        private int saveCalls;
        private String deletedId;

        private OcorrenciaRepository createProxy() {
            return (OcorrenciaRepository) Proxy.newProxyInstance(
                    OcorrenciaRepository.class.getClassLoader(),
                    new Class<?>[]{OcorrenciaRepository.class},
                    (proxy, method, args) -> switch (method.getName()) {
                        case "findAll" -> findAllResult;
                        case "findById" -> findByIdResult;
                        case "save" -> {
                            saveCalls++;
                            yield saveReturnsArgument ? args[0] : savedEntity;
                        }
                        case "existsById" -> existsByIdResult;
                        case "deleteById" -> {
                            deletedId = (String) args[0];
                            yield null;
                        }
                        case "toString" -> "RepositoryStub";
                        case "hashCode" -> System.identityHashCode(proxy);
                        case "equals" -> proxy == args[0];
                        default -> throw new UnsupportedOperationException(method.getName());
                    });
        }
    }
}
