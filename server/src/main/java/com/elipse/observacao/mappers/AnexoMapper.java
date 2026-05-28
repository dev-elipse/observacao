package com.elipse.observacao.mappers;

import com.elipse.observacao.dtos.AnexoDTO;
import com.elipse.observacao.entities.AnexoEntity;

public class AnexoMapper {

    public static AnexoEntity toEntity(AnexoDTO dto){
        AnexoEntity entity = new AnexoEntity();

        entity.setUrlArquivo(dto.getUrlArquivo());

        return entity;
    }

    public static AnexoDTO toDTO(AnexoEntity entity){
        AnexoDTO dto = new AnexoDTO();

        dto.setId(entity.getId());
        dto.setUrlArquivo(entity.getUrlArquivo());

        if (entity.getSolicitacao() != null){
            dto.setSolicitacaoId(entity.getSolicitacao().getId());
        }

        return dto;
    }

    public static void updateEntity(AnexoEntity entity, AnexoDTO dto){
        entity.setUrlArquivo(dto.getUrlArquivo());
    }
}
