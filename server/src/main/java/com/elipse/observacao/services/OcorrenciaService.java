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
import java.util.ArrayList;
import com.elipse.observacao.entities.HistoricoStatus;
import com.elipse.observacao.repositories.CidadaoRepository;

@Service
@RequiredArgsConstructor
public class OcorrenciaService {

    private final OcorrenciaRepository ocorrenciaRepository;
    private final CidadaoRepository cidadaoRepository;

    private void validarCidadao(String id) {
        if (id != null && !cidadaoRepository.existsById(id)) {
            throw new EntityNotFoundException("cidadao not found");
        }
    }

    public OcorrenciaResponseDTO create(OcorrenciaCreateDTO dto) {
        validarCidadao(dto.getCidadaoId());
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

        validarCidadao(dto.getCidadaoId());
        var statusAnterior = entity.getStatus();
        OcorrenciaMapper.updateEntity(entity, dto);
        entity.preUpdate();
        if (entity.getStatus() != statusAnterior) {
            var historico = entity.getHistoricoStatus() == null
                    ? new ArrayList<HistoricoStatus>() : new ArrayList<>(entity.getHistoricoStatus());
            historico.add(new HistoricoStatus(entity.getStatus(), entity.getUpdatedAt()));
            entity.setHistoricoStatus(historico);
        }

        return OcorrenciaMapper.toDTO(ocorrenciaRepository.save(entity));
    }

    public void delete(String id) {
        if (!ocorrenciaRepository.existsById(id)) {
            throw new EntityNotFoundException("ocorrencia not found");
        }
        ocorrenciaRepository.deleteById(id);
    }
}
