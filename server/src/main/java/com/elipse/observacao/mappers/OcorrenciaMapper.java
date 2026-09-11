package com.elipse.observacao.mappers;

import com.elipse.observacao.dtos.EnderecoDTO;
import com.elipse.observacao.dtos.OcorrenciaCreateDTO;
import com.elipse.observacao.dtos.OcorrenciaResponseDTO;
import com.elipse.observacao.entities.Endereco;
import com.elipse.observacao.entities.OcorrenciaEntity;
import com.elipse.observacao.enums.PrioridadeOcorrencia;
import com.elipse.observacao.enums.StatusOcorrencia;

public class OcorrenciaMapper {

    public static Endereco toEndereco(EnderecoDTO dto) {
        if (dto == null) {
            return null;
        }
        Endereco endereco = new Endereco();
        endereco.setRua(dto.getRua());
        endereco.setNumero(dto.getNumero());
        endereco.setBairro(dto.getBairro());
        return endereco;
    }

    public static EnderecoDTO toEnderecoDTO(Endereco endereco) {
        if (endereco == null) {
            return null;
        }
        EnderecoDTO dto = new EnderecoDTO();
        dto.setRua(endereco.getRua());
        dto.setNumero(endereco.getNumero());
        dto.setBairro(endereco.getBairro());
        return dto;
    }

    public static OcorrenciaEntity toEntity(OcorrenciaCreateDTO dto) {
        OcorrenciaEntity entity = new OcorrenciaEntity();

        entity.setTitulo(dto.getTitulo());
        entity.setDescricao(dto.getDescricao());
        entity.setCategoria(dto.getCategoria());
        entity.setEndereco(toEndereco(dto.getEndereco()));
        entity.setPrioridade(
                dto.getPrioridade() != null ? dto.getPrioridade() : PrioridadeOcorrencia.MEDIA);
        entity.setStatus(
                dto.getStatus() != null ? dto.getStatus() : StatusOcorrencia.ABERTA);

        return entity;
    }

    public static OcorrenciaResponseDTO toDTO(OcorrenciaEntity entity) {
        OcorrenciaResponseDTO dto = new OcorrenciaResponseDTO();

        dto.setId(entity.getId());
        dto.setTitulo(entity.getTitulo());
        dto.setDescricao(entity.getDescricao());
        dto.setCategoria(entity.getCategoria());
        dto.setEndereco(toEnderecoDTO(entity.getEndereco()));
        dto.setPrioridade(entity.getPrioridade());
        dto.setStatus(entity.getStatus());
        dto.setCreatedAt(entity.getCreatedAt());
        dto.setUpdatedAt(entity.getUpdatedAt());

        return dto;
    }

    public static void updateEntity(OcorrenciaEntity entity, OcorrenciaCreateDTO dto) {
        entity.setTitulo(dto.getTitulo());
        entity.setDescricao(dto.getDescricao());
        entity.setCategoria(dto.getCategoria());
        entity.setEndereco(toEndereco(dto.getEndereco()));

        if (dto.getPrioridade() != null) {
            entity.setPrioridade(dto.getPrioridade());
        }
        if (dto.getStatus() != null) {
            entity.setStatus(dto.getStatus());
        }
    }
}
