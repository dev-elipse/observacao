package com.elipse.observacao.services;

import com.elipse.observacao.dtos.CidadaoCreateDTO;
import com.elipse.observacao.dtos.CidadaoResponseDTO;
import com.elipse.observacao.entities.CidadaoEntity;
import com.elipse.observacao.exceptions.EntityNotFoundException;
import com.elipse.observacao.mappers.CidadaoMapper;
import com.elipse.observacao.repositories.CidadaoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CidadaoService {

    private final CidadaoRepository cidadaoRepository;

    public CidadaoResponseDTO create(CidadaoCreateDTO dto) {
        CidadaoEntity entity = CidadaoMapper.toEntity(dto);

        return CidadaoMapper.toDTO(cidadaoRepository.save(entity));
    }

    public List<CidadaoResponseDTO> findAll() {
        return cidadaoRepository.findAll().stream()
                .map(CidadaoMapper::toDTO)
                .toList();
    }

    public CidadaoResponseDTO findById(String id) {
        return CidadaoMapper.toDTO(cidadaoRepository
                .findById(id)
                .orElseThrow(() -> new EntityNotFoundException("cidadao not found")));
    }

    public CidadaoResponseDTO update(String id, CidadaoCreateDTO dto) {
        CidadaoEntity entity = cidadaoRepository
                .findById(id)
                .orElseThrow(() -> new EntityNotFoundException("cidadao not found"));

        CidadaoMapper.updateEntity(entity, dto);

        return CidadaoMapper.toDTO(cidadaoRepository.save(entity));
    }

    public void delete(String id) {
        if (!cidadaoRepository.existsById(id)) {
            throw new EntityNotFoundException("cidadao not found");
        }
        cidadaoRepository.deleteById(id);
    }
}
