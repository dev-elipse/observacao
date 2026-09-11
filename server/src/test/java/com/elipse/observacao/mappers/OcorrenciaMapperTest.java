package com.elipse.observacao.mappers;

import com.elipse.observacao.dtos.EnderecoDTO;
import com.elipse.observacao.dtos.OcorrenciaCreateDTO;
import com.elipse.observacao.dtos.OcorrenciaResponseDTO;
import com.elipse.observacao.entities.Endereco;
import com.elipse.observacao.entities.OcorrenciaEntity;
import com.elipse.observacao.enums.CategoriaOcorrencia;
import com.elipse.observacao.enums.PrioridadeOcorrencia;
import com.elipse.observacao.enums.StatusOcorrencia;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class OcorrenciaMapperTest {

    @Test
    void deveConverterCreateDTOParaEntity() {
        EnderecoDTO enderecoDTO = new EnderecoDTO();
        enderecoDTO.setRua("Rua dos Ipês");
        enderecoDTO.setNumero("78");
        enderecoDTO.setBairro("Vila Nova");

        OcorrenciaCreateDTO dto = new OcorrenciaCreateDTO();
        dto.setTitulo("Lixo acumulado");
        dto.setDescricao("Entulho não recolhido há dias.");
        dto.setCategoria(CategoriaOcorrencia.LIMPEZA);
        dto.setEndereco(enderecoDTO);
        dto.setPrioridade(PrioridadeOcorrencia.BAIXA);
        dto.setStatus(StatusOcorrencia.RESOLVIDA);

        OcorrenciaEntity entity = OcorrenciaMapper.toEntity(dto);

        assertThat(entity.getTitulo()).isEqualTo("Lixo acumulado");
        assertThat(entity.getCategoria()).isEqualTo(CategoriaOcorrencia.LIMPEZA);
        assertThat(entity.getEndereco().getBairro()).isEqualTo("Vila Nova");
        assertThat(entity.getPrioridade()).isEqualTo(PrioridadeOcorrencia.BAIXA);
        assertThat(entity.getStatus()).isEqualTo(StatusOcorrencia.RESOLVIDA);
    }

    @Test
    void deveAplicarValoresPadraoQuandoPrioridadeEStatusForemNulos() {
        OcorrenciaCreateDTO dto = new OcorrenciaCreateDTO();
        dto.setTitulo("Poste apagado");
        dto.setDescricao("Iluminação apagada há uma semana.");
        dto.setCategoria(CategoriaOcorrencia.ILUMINACAO);
        dto.setEndereco(new EnderecoDTO());
        dto.setPrioridade(null);
        dto.setStatus(null);

        OcorrenciaEntity entity = OcorrenciaMapper.toEntity(dto);

        assertThat(entity.getPrioridade()).isEqualTo(PrioridadeOcorrencia.MEDIA);
        assertThat(entity.getStatus()).isEqualTo(StatusOcorrencia.ABERTA);
    }

    @Test
    void deveConverterEntityParaResponseDTO() {
        Endereco endereco = new Endereco("Avenida Central", "45", "Jardim América");
        OcorrenciaEntity entity = new OcorrenciaEntity();
        entity.setId("ocr-02");
        entity.setTitulo("Lâmpada queimada");
        entity.setDescricao("Poste apagado há uma semana.");
        entity.setCategoria(CategoriaOcorrencia.ILUMINACAO);
        entity.setEndereco(endereco);
        entity.setPrioridade(PrioridadeOcorrencia.MEDIA);
        entity.setStatus(StatusOcorrencia.EM_ANALISE);
        entity.prePersist();

        OcorrenciaResponseDTO dto = OcorrenciaMapper.toDTO(entity);

        assertThat(dto.getId()).isEqualTo("ocr-02");
        assertThat(dto.getEndereco().getRua()).isEqualTo("Avenida Central");
        assertThat(dto.getStatus()).isEqualTo(StatusOcorrencia.EM_ANALISE);
        assertThat(dto.getCreatedAt()).isNotNull();
        assertThat(dto.getUpdatedAt()).isNotNull();
    }

    @Test
    void deveRetornarNuloAoConverterEnderecoNulo() {
        assertThat(OcorrenciaMapper.toEndereco(null)).isNull();
        assertThat(OcorrenciaMapper.toEnderecoDTO(null)).isNull();
    }

    @Test
    void deveAtualizarEntityExistenteComDadosDoDTO() {
        OcorrenciaEntity entity = new OcorrenciaEntity();
        entity.setId("ocr-03");
        entity.setTitulo("Buraco na via");
        entity.setStatus(StatusOcorrencia.ABERTA);
        entity.prePersist();

        EnderecoDTO novoEndereco = new EnderecoDTO();
        novoEndereco.setRua("Rua Nova");
        novoEndereco.setNumero("10");
        novoEndereco.setBairro("Bairro Novo");

        OcorrenciaCreateDTO updateDTO = new OcorrenciaCreateDTO();
        updateDTO.setTitulo("Buraco reparado");
        updateDTO.setDescricao("Serviço concluído.");
        updateDTO.setCategoria(CategoriaOcorrencia.INFRAESTRUTURA);
        updateDTO.setEndereco(novoEndereco);
        updateDTO.setPrioridade(PrioridadeOcorrencia.BAIXA);
        updateDTO.setStatus(StatusOcorrencia.RESOLVIDA);

        OcorrenciaMapper.updateEntity(entity, updateDTO);

        assertThat(entity.getId()).isEqualTo("ocr-03");
        assertThat(entity.getTitulo()).isEqualTo("Buraco reparado");
        assertThat(entity.getEndereco().getBairro()).isEqualTo("Bairro Novo");
        assertThat(entity.getStatus()).isEqualTo(StatusOcorrencia.RESOLVIDA);
    }
}
