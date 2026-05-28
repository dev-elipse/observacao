package com.elipse.observacao.mappers;

import com.elipse.observacao.dtos.EnderecoDTO;
import com.elipse.observacao.entities.EnderecoEntity;

public class EnderecoMapper {

    public static EnderecoEntity toEntity(EnderecoDTO dto){
        EnderecoEntity entity = new EnderecoEntity();

        entity.setCidade(dto.getCidade());
        entity.setBairro(dto.getBairro());
        entity.setLogradouro(dto.getLogradouro());
        entity.setPontoReferencia(dto.getPontoReferencia());
        entity.setCep(dto.getCep());

        return entity;
    }

    public static EnderecoDTO toDTO(EnderecoEntity entity){
        EnderecoDTO dto = new EnderecoDTO();

        dto.setId(entity.getId());
        dto.setCidade(entity.getCidade());
        dto.setBairro(entity.getBairro());
        dto.setLogradouro(entity.getLogradouro());
        dto.setPontoReferencia(entity.getPontoReferencia());
        dto.setCep(entity.getCep());

        if (entity.getSolicitacao() != null) {
            dto.setSolicitacaoId(entity.getSolicitacao().getId());
        }

        return dto;
    }

    public static void updateEntity(EnderecoEntity entity, EnderecoDTO dto){
        entity.setCidade(dto.getCidade());
        entity.setBairro(dto.getBairro());
        entity.setLogradouro(dto.getLogradouro());
        entity.setPontoReferencia(dto.getPontoReferencia());
        entity.setCep(dto.getCep());
    }
}
