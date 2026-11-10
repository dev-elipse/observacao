package com.elipse.observacao.mappers;

import com.elipse.observacao.dtos.CidadaoCreateDTO;
import com.elipse.observacao.dtos.CidadaoEnderecoDTO;
import org.junit.jupiter.api.Test;
import java.util.List;
import static org.assertj.core.api.Assertions.assertThat;

class CidadaoMapperTest {
    @Test
    void deveCopiarTodosOsCamposSemCompartilharSubdocumentos() {
        CidadaoEnderecoDTO endereco = new CidadaoEnderecoDTO();
        endereco.setRua("Rua A");
        endereco.setNumero("10");
        endereco.setBairro("Centro");
        endereco.setCidade("Maringa");
        endereco.setEstado("PR");
        CidadaoCreateDTO dto = new CidadaoCreateDTO();
        dto.setNome("Ana");
        dto.setEmail("ana@example.com");
        dto.setEnderecos(List.of(endereco));
        var entity = CidadaoMapper.toEntity(dto);
        var response = CidadaoMapper.toDTO(entity);
        assertThat(entity.getId()).isNotBlank();
        assertThat(response.getId()).isEqualTo(entity.getId());
        assertThat(response.getNome()).isEqualTo(dto.getNome());
        assertThat(response.getEmail()).isEqualTo(dto.getEmail());
        assertThat(response.getEnderecos().get(0)).usingRecursiveComparison().isEqualTo(endereco);
        endereco.setCidade("Outra cidade");
        response.getEnderecos().get(0).setRua("Outra rua");
        assertThat(entity.getEnderecos().get(0).getCidade()).isEqualTo("Maringa");
        assertThat(entity.getEnderecos().get(0).getRua()).isEqualTo("Rua A");
    }
}
