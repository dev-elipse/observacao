package com.elipse.observacao.controllers;

import com.elipse.observacao.dtos.*;
import com.elipse.observacao.entities.CidadaoEntity;
import com.elipse.observacao.repositories.CidadaoRepository;
import com.elipse.observacao.services.*;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.*;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.mock.web.MockHttpSession;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.http.MediaType;
import java.lang.reflect.Proxy;
import java.util.*;
import static org.assertj.core.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

class ContaControllerTest {
    private MockMvc mvc;
    private Map<String,CidadaoEntity> dados;
    private ContaService service;
    private CidadaoService cidadaos;
    private final ObjectMapper json = new ObjectMapper();
    private final CadastroContaDTO cadastro = new CadastroContaDTO("Ana Teste", "00000000000", "ana@example.com", "44999999999", "senha-teste-123");

    @BeforeEach
    void preparar() {
        dados = new HashMap<>();
        var repo = (CidadaoRepository) Proxy.newProxyInstance(CidadaoRepository.class.getClassLoader(),
                new Class<?>[]{CidadaoRepository.class}, (proxy, method, args) -> switch(method.getName()) {
                    case "findByEmail" -> dados.values().stream().filter(e -> e.getEmail().equals(args[0])).findFirst();
                    case "findById" -> Optional.ofNullable(dados.get(args[0]));
                    case "existsById" -> dados.containsKey(args[0]);
                    case "findAll" -> new ArrayList<>(dados.values());
                    case "save" -> {
                        var entity = (CidadaoEntity) args[0];
                        if (dados.values().stream().anyMatch(e -> e.getEmail().equals(entity.getEmail()))) throw new DuplicateKeyException("email");
                        dados.put(entity.getId(), entity); yield entity;
                    }
                    default -> throw new UnsupportedOperationException(method.getName());
                });
        service = new ContaService(repo); cidadaos = new CidadaoService(repo);
        mvc = MockMvcBuilders.standaloneSetup(new ContaController(service)).build();
    }

    @Test
    void deveCadastrarComCpfFicticioSemExporDadosPrivados() throws Exception {
        mvc.perform(post("/api/conta/cadastro").contentType(MediaType.APPLICATION_JSON).content(json.writeValueAsString(cadastro)))
                .andExpect(status().isCreated()).andExpect(jsonPath("$.nome").value("Ana Teste"))
                .andExpect(jsonPath("$.senha").doesNotExist()).andExpect(jsonPath("$.senhaHash").doesNotExist())
                .andExpect(jsonPath("$.cpf").doesNotExist()).andExpect(jsonPath("$.telefone").doesNotExist());
        var entity = dados.values().iterator().next();
        assertThat(entity.getCpf()).isEqualTo("00000000000");
        assertThat(entity.getTelefone()).isEqualTo("44999999999");
        assertThat(entity.getSenhaHash()).doesNotContain(cadastro.senha());
        assertThat(json.writeValueAsString(entity)).doesNotContain("senhaHash");
        assertThat(cidadaos.findById(entity.getId()).getEmail()).isEqualTo(cadastro.email());
        var perfil = cidadaos.findById(entity.getId());
        assertThat(perfil.getNome()).isEqualTo(cadastro.nome());
        assertThat(perfil.getCpf()).isEqualTo(cadastro.cpf());
        assertThat(perfil.getTelefone()).isEqualTo(cadastro.telefone());
        assertThat(json.writeValueAsString(perfil)).doesNotContain("senha", "senhaHash");
    }

    @Test
    void deveAutenticarRenovarSessaoConsultarESair() throws Exception {
        var conta = service.cadastrar(cadastro);
        var antiga = new MockHttpSession();
        var result = mvc.perform(post("/api/conta/login").session(antiga).contentType(MediaType.APPLICATION_JSON)
                        .content(json.writeValueAsString(new LoginDTO(cadastro.email(), cadastro.senha()))))
                .andExpect(status().isOk()).andReturn();
        assertThat(antiga.isInvalid()).isTrue();
        var sessao = (MockHttpSession) result.getRequest().getSession(false);
        assertThat(sessao.getAttribute(ContaController.CIDADAO_SESSAO)).isEqualTo(conta.id());
        mvc.perform(get("/api/conta").session(sessao)).andExpect(status().isOk()).andExpect(jsonPath("$.id").value(conta.id()));
        mvc.perform(post("/api/conta/logout").session(sessao)).andExpect(status().isNoContent());
        assertThat(sessao.isInvalid()).isTrue();
        mvc.perform(get("/api/conta")).andExpect(status().isUnauthorized());
        mvc.perform(post("/api/conta/logout")).andExpect(status().isNoContent());
    }

    @Test
    void deveRejeitarSenhaIncorretaEmailAusenteESessaoSemConta() throws Exception {
        service.cadastrar(cadastro);
        for (var login : List.of(new LoginDTO(cadastro.email(), "errada"), new LoginDTO("outro@example.com", "errada"))) {
            mvc.perform(post("/api/conta/login").contentType(MediaType.APPLICATION_JSON).content(json.writeValueAsString(login)))
                    .andExpect(status().isUnauthorized());
        }
        mvc.perform(get("/api/conta").session(new MockHttpSession())).andExpect(status().isUnauthorized());
        var sessao = new MockHttpSession(); sessao.setAttribute(ContaController.CIDADAO_SESSAO, "ausente");
        mvc.perform(get("/api/conta").session(sessao)).andExpect(status().isUnauthorized());
    }

    @Test
    void deveRejeitarCamposInvalidosEEmailDuplicado() throws Exception {
        mvc.perform(post("/api/conta/cadastro").contentType(MediaType.APPLICATION_JSON).content("{}"))
                .andExpect(status().isBadRequest());
        var invalido = new CadastroContaDTO(" ", "123", "invalido", "123", "123");
        mvc.perform(post("/api/conta/cadastro").contentType(MediaType.APPLICATION_JSON).content(json.writeValueAsString(invalido)))
                .andExpect(status().isBadRequest());
        assertThat(dados).isEmpty();
        service.cadastrar(cadastro);
        mvc.perform(post("/api/conta/cadastro").contentType(MediaType.APPLICATION_JSON).content(json.writeValueAsString(cadastro)))
                .andExpect(status().isConflict());
    }

    @Test
    void deveUsarSaltDiferenteEImpedirAlteracaoPublicaDaConta() {
        var conta = service.cadastrar(cadastro);
        var outra = service.cadastrar(new CadastroContaDTO("Outra Pessoa", "00000000000", "outra@example.com", "44999999999", cadastro.senha()));
        assertThat(dados.get(conta.id()).getSenhaHash()).isNotEqualTo(dados.get(outra.id()).getSenhaHash());
        var dto = new CidadaoCreateDTO(); dto.setNome("Alterado"); dto.setEmail("outro@example.com");
        assertThatThrownBy(() -> cidadaos.update(conta.id(), dto)).isInstanceOf(org.springframework.web.server.ResponseStatusException.class);
        assertThatThrownBy(() -> cidadaos.delete(conta.id())).isInstanceOf(org.springframework.web.server.ResponseStatusException.class);
        assertThat(dados.get(conta.id()).getEmail()).isEqualTo(cadastro.email());
    }

    @Test
    void cadastroAntigoNaoDevePermitirLoginSemSenha() {
        var antigo = new CidadaoEntity(); antigo.setEmail("antigo@example.com"); dados.put(antigo.getId(), antigo);
        assertThatThrownBy(() -> service.entrar(new LoginDTO(antigo.getEmail(), "qualquer")))
                .isInstanceOf(org.springframework.web.server.ResponseStatusException.class);
        assertThatThrownBy(() -> service.consultar(antigo.getId())).isInstanceOf(org.springframework.web.server.ResponseStatusException.class);
    }
}
