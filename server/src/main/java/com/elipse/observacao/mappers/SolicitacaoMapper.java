package com.elipse.observacao.mappers;

import com.elipse.observacao.dtos.SolicitacaoCreateDTO;
import com.elipse.observacao.dtos.SolicitacaoResponseDTO;
import com.elipse.observacao.entities.SolicitacaoEntity;
import com.elipse.observacao.entities.UsuarioEntity;
import com.elipse.observacao.enums.PrioridadeSolicitacao;
import com.elipse.observacao.enums.StatusSolicitacao;

public class SolicitacaoMapper {

    public static SolicitacaoEntity toEntity(SolicitacaoCreateDTO dto, UsuarioEntity usuario) {
        SolicitacaoEntity entity = new SolicitacaoEntity();

        entity.setDescricao(dto.getDescricao());
        entity.setCategoria(dto.getCategoria());

        entity.setStatus(StatusSolicitacao.ABERTO);

        entity.setPrioridade(
                dto.getPrioridade() != null
                        ? dto.getPrioridade()
                        : PrioridadeSolicitacao.MEDIA
        );

        entity.setAnonima(
                dto.getAnonima() != null
                        ? dto.getAnonima()
                        : false);

        entity.setUsuario(usuario);

        return entity;
    }

    public static SolicitacaoResponseDTO toDTO(SolicitacaoEntity entity){
        SolicitacaoResponseDTO dto = new SolicitacaoResponseDTO();

        dto.setId(entity.getId());
        dto.setDescricao(entity.getDescricao());
        dto.setCategoria(entity.getCategoria());
        dto.setStatus(entity.getStatus());
        dto.setPrioridade(entity.getPrioridade());
        dto.setAnonima(entity.isAnonima());
        dto.setCreatedAt(entity.getCreatedAt());
        dto.setUpdatedAt(entity.getUpdatedAt());

        if (entity.getUsuario() != null) {
            dto.setNomeUsuario(entity.getUsuario().getNome());
            dto.setUsuarioId(entity.getUsuario().getId());
        }

        return dto;
    }

    public static void updateEntity(SolicitacaoEntity entity, SolicitacaoCreateDTO dto, UsuarioEntity usuario){
        entity.setDescricao(dto.getDescricao());
        entity.setCategoria(dto.getCategoria());

        if (dto.getPrioridade() != null){
            entity.setPrioridade(dto.getPrioridade());
        }


        entity.setAnonima(
                dto.getAnonima() != null
                        ? dto.getAnonima()
                        : false);

        entity.setUsuario(usuario);
    }
}
