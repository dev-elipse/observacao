package com.elipse.observacao.mappers;

import com.elipse.observacao.dtos.UsuarioDTO;
import com.elipse.observacao.entities.UsuarioEntity;

public class UsuarioMapper {

    public static UsuarioEntity toEntity(UsuarioDTO dto) {
        UsuarioEntity entity = new UsuarioEntity();
        entity.setNome(dto.getNome());
        entity.setEmail(dto.getEmail());
        entity.setNumeroTelefone(dto.getNumeroTelefone());
        entity.setCargo(dto.getCargo());
        entity.setTipo(dto.getTipo());
        if (dto.getSenha() != null && !dto.getSenha().isBlank()) {
            entity.setSenha(dto.getSenha());
        }
        return entity;
    }

    public static UsuarioDTO toDTO(UsuarioEntity entity) {
        UsuarioDTO dto = new UsuarioDTO();
        dto.setId(entity.getId());
        dto.setNome(entity.getNome());
        dto.setEmail(entity.getEmail());
        dto.setNumeroTelefone(entity.getNumeroTelefone());
        dto.setCargo(entity.getCargo());
        dto.setTipo(entity.getTipo());
        return dto;
    }

    public static void updateEntity(UsuarioEntity entity, UsuarioDTO dto) {
        entity.setNome(dto.getNome());
        entity.setEmail(dto.getEmail());
        entity.setNumeroTelefone(dto.getNumeroTelefone());
        entity.setCargo(dto.getCargo());
        entity.setTipo(dto.getTipo());
        if (dto.getSenha() != null && !dto.getSenha().isBlank()) {
            entity.setSenha(dto.getSenha());
        }
    }
}