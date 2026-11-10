package com.elipse.observacao.services;

import com.elipse.observacao.dtos.CidadaoCreateDTO;
import com.elipse.observacao.entities.CidadaoEntity;
import com.elipse.observacao.repositories.CidadaoRepository;
import org.junit.jupiter.api.Test;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.dao.DataAccessResourceFailureException;
import java.lang.reflect.Proxy;
import java.util.Optional;
import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class CidadaoServiceTest {
    private CidadaoCreateDTO entrada() {
        var dto = new CidadaoCreateDTO();
        dto.setNome("Ana");
        dto.setEmail("ana@example.com");
        return dto;
    }

    @Test
    void devePropagarConflitoDoIndiceUnicoAoCriarEAtualizar() {
        var entity = new CidadaoEntity();
        entity.setId("cid-01");
        var conflito = new DuplicateKeyException("email duplicado");
        var repository = (CidadaoRepository) Proxy.newProxyInstance(
                CidadaoRepository.class.getClassLoader(), new Class<?>[]{CidadaoRepository.class},
                (proxy, method, args) -> {
                    if (method.getName().equals("findById")) return Optional.of(entity);
                    if (method.getName().equals("save")) throw conflito;
                    throw new UnsupportedOperationException(method.getName());
                });
        var service = new CidadaoService(repository);
        assertThatThrownBy(() -> service.create(entrada())).isSameAs(conflito);
        assertThatThrownBy(() -> service.update("cid-01", entrada())).isSameAs(conflito);
        assertThat(entity.getId()).isEqualTo("cid-01");
    }

    @Test
    void devePropagarFalhaDoBancoSemConfundirComRegistroInexistente() {
        var falha = new DataAccessResourceFailureException("banco indisponivel");
        var repository = (CidadaoRepository) Proxy.newProxyInstance(
                CidadaoRepository.class.getClassLoader(), new Class<?>[]{CidadaoRepository.class},
                (proxy, method, args) -> { throw falha; });
        var service = new CidadaoService(repository);
        assertThatThrownBy(service::findAll).isSameAs(falha);
        assertThatThrownBy(() -> service.findById("cid-01")).isSameAs(falha);
        assertThatThrownBy(() -> service.delete("cid-01")).isSameAs(falha);
    }
}
