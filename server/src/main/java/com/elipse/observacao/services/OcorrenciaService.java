package com.elipse.observacao.services;

import com.elipse.observacao.dtos.OcorrenciaCreateDTO;
import com.elipse.observacao.dtos.OcorrenciaResponseDTO;
import com.elipse.observacao.entities.OcorrenciaEntity;
import com.elipse.observacao.exceptions.EntityNotFoundException;
import com.elipse.observacao.mappers.OcorrenciaMapper;
import com.elipse.observacao.repositories.OcorrenciaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class OcorrenciaService {

    private final OcorrenciaRepository ocorrenciaRepository;

    public OcorrenciaResponseDTO create(OcorrenciaCreateDTO dto) {
        OcorrenciaEntity entity = OcorrenciaMapper.toEntity(dto);
        entity.prePersist();

        return OcorrenciaMapper.toDTO(ocorrenciaRepository.save(entity));
    }

    public List<OcorrenciaResponseDTO> findAll() {
        return ocorrenciaRepository.findAll().stream()
                .map(OcorrenciaMapper::toDTO)
                .toList();
    }

    public OcorrenciaResponseDTO findById(String id) {
        return OcorrenciaMapper.toDTO(ocorrenciaRepository
                .findById(id)
                .orElseThrow(() -> new EntityNotFoundException("ocorrencia not found")));
    }

    public OcorrenciaResponseDTO update(String id, OcorrenciaCreateDTO dto) {
        OcorrenciaEntity entity = ocorrenciaRepository
                .findById(id)
                .orElseThrow(() -> new EntityNotFoundException("ocorrencia not found"));

        OcorrenciaMapper.updateEntity(entity, dto);
        entity.preUpdate();

        return OcorrenciaMapper.toDTO(ocorrenciaRepository.save(entity));
    }

    public void delete(String id) {
        if (!ocorrenciaRepository.existsById(id)) {
            throw new EntityNotFoundException("ocorrencia not found");
        }
        ocorrenciaRepository.deleteById(id);
    }
}
