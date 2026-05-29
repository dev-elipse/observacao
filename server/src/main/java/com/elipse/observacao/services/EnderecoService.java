package com.elipse.observacao.services;

import com.elipse.observacao.dtos.EnderecoDTO;
import com.elipse.observacao.entities.EnderecoEntity;
import com.elipse.observacao.entities.SolicitacaoEntity;
import com.elipse.observacao.mappers.EnderecoMapper;
import com.elipse.observacao.repositories.EnderecoRepository;
import com.elipse.observacao.repositories.SolicitacaoRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class EnderecoService {

    private final EnderecoRepository enderecoRepository;
    private final SolicitacaoRepository solicitacaoRepository;

    @Transactional
    public EnderecoDTO create(EnderecoDTO dto){
        if (enderecoRepository.existsById(dto.getSolicitacaoId())){
            throw new EntityNotFoundException("endereco already exists");
        }

        SolicitacaoEntity solicitacao = solicitacaoRepository
                .findById(dto.getSolicitacaoId())
                .orElseThrow(() -> new EntityNotFoundException("solicitacao not found"));

        EnderecoEntity entity = EnderecoMapper.toEntity(dto);
        entity.setSolicitacao(solicitacao);
        return EnderecoMapper.toDTO(enderecoRepository.save(entity));
    }

    @Transactional(readOnly = true)
    public List<EnderecoDTO> findAll(){
        return enderecoRepository.findAll().stream()
                .map(EnderecoMapper::toDTO)
                .toList();
    }

    @Transactional(readOnly = true)
    public EnderecoDTO findById(Long id){
        return EnderecoMapper.toDTO(enderecoRepository
                .findById(id).orElseThrow(() -> new EntityNotFoundException("endereco not found")));
    }

    @Transactional
    public EnderecoDTO update(Long id, EnderecoDTO dto){
        EnderecoEntity entity = enderecoRepository
                .findById(id)
                .orElseThrow(() -> new EntityNotFoundException("endereco not found"));

        EnderecoMapper.updateEntity(entity, dto);
        return EnderecoMapper.toDTO(entity);
    }

    @Transactional
    public void delete(Long id){
        if (!enderecoRepository.existsById(id)){
            throw new EntityNotFoundException("endereco not found");
        }
        enderecoRepository.deleteById(id);
    }
}