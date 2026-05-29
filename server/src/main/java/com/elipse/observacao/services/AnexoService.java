package com.elipse.observacao.services;

import com.elipse.observacao.dtos.AnexoDTO;
import com.elipse.observacao.entities.AnexoEntity;
import com.elipse.observacao.entities.SolicitacaoEntity;
import com.elipse.observacao.mappers.AnexoMapper;
import com.elipse.observacao.repositories.AnexoRepository;
import com.elipse.observacao.repositories.SolicitacaoRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AnexoService {

    private final AnexoRepository anexoRepository;
    private final SolicitacaoRepository solicitacaoRepository;

    @Transactional
    public AnexoDTO create(AnexoDTO dto){
        if (anexoRepository.existsById(dto.getSolicitacaoId())){
            throw new EntityNotFoundException("anexo already exists");
        }

        SolicitacaoEntity solicitacao = solicitacaoRepository
                .findById(dto.getSolicitacaoId())
                .orElseThrow(() -> new EntityNotFoundException("solicitacao not found"));

        AnexoEntity entity = AnexoMapper.toEntity(dto);
        entity.setSolicitacao(solicitacao);

        return AnexoMapper.toDTO(anexoRepository.save(entity));
    }

    @Transactional(readOnly = true)
    public List<AnexoDTO> findAll(){
        return anexoRepository.findAll().stream()
                .map(AnexoMapper::toDTO)
                .toList();
    }

    @Transactional(readOnly = true)
    public AnexoDTO findById(Long id){
        return AnexoMapper.toDTO(anexoRepository
                .findById(id).orElseThrow(() -> new EntityNotFoundException("anexo not found")));
    }

    @Transactional
    public AnexoDTO update(Long id, AnexoDTO dto){
        AnexoEntity entity = anexoRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("anexo not found"));

        AnexoMapper.updateEntity(entity, dto);
        return AnexoMapper.toDTO(entity);
    }

    public void delete(Long id){
        if (!anexoRepository.existsById(id)){
            throw new EntityNotFoundException("anexo not found");
        }
        anexoRepository.deleteById(id);
    }
}
