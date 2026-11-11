package com.elipse.observacao.mappers;

import com.elipse.observacao.dtos.CidadaoCreateDTO;
import com.elipse.observacao.dtos.CidadaoResponseDTO;
import com.elipse.observacao.dtos.CidadaoEnderecoDTO;
import com.elipse.observacao.entities.CidadaoEntity;
import com.elipse.observacao.entities.CidadaoEndereco;

public class CidadaoMapper {
    public static CidadaoEntity toEntity(CidadaoCreateDTO dto) {
        CidadaoEntity entity = new CidadaoEntity();
        updateEntity(entity, dto);
        return entity;
    }

    public static void updateEntity(CidadaoEntity entity, CidadaoCreateDTO dto) {
        entity.setNome(dto.getNome());
        entity.setEmail(dto.getEmail());
        entity.setEnderecos(dto.getEnderecos().stream().map(CidadaoMapper::toEndereco).toList());
    }

    public static CidadaoResponseDTO toDTO(CidadaoEntity entity) {
        CidadaoResponseDTO dto = new CidadaoResponseDTO();
        dto.setId(entity.getId());
        dto.setNome(entity.getNome());
        dto.setCpf(entity.getCpf());
        dto.setTelefone(entity.getTelefone());
        dto.setEmail(entity.getEmail());
        dto.setEnderecos(entity.getEnderecos().stream().map(CidadaoMapper::toEnderecoDTO).toList());
        return dto;
    }

    private static CidadaoEndereco toEndereco(CidadaoEnderecoDTO dto) {
        CidadaoEndereco endereco = new CidadaoEndereco();
        endereco.setRua(dto.getRua());
        endereco.setNumero(dto.getNumero());
        endereco.setBairro(dto.getBairro());
        endereco.setCidade(dto.getCidade());
        endereco.setEstado(dto.getEstado());
        return endereco;
    }

    private static CidadaoEnderecoDTO toEnderecoDTO(CidadaoEndereco endereco) {
        CidadaoEnderecoDTO dto = new CidadaoEnderecoDTO();
        dto.setRua(endereco.getRua());
        dto.setNumero(endereco.getNumero());
        dto.setBairro(endereco.getBairro());
        dto.setCidade(endereco.getCidade());
        dto.setEstado(endereco.getEstado());
        return dto;
    }
}
