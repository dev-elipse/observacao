package com.elipse.observacao.services;

import com.elipse.observacao.dtos.SolicitacaoCreateDTO;
import com.elipse.observacao.dtos.SolicitacaoResponseDTO;
import com.elipse.observacao.entities.SolicitacaoEntity;
import com.elipse.observacao.entities.UsuarioEntity;
import com.elipse.observacao.mappers.SolicitacaoMapper;
import com.elipse.observacao.repositories.SolicitacaoRepository;
import com.elipse.observacao.repositories.UsuarioRepository;
import jakarta.persistence.EntityNotFoundException;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SolicitacaoService {

    private final SolicitacaoRepository solicitacaoRepository;
    private final UsuarioRepository usuarioRepository;

    private void validarAnonimato(SolicitacaoCreateDTO dto) {
        boolean anonima = Boolean.TRUE.equals(dto.getAnonima());

        if (!anonima && dto.getUsuarioId() == null) {
            throw new IllegalArgumentException(
                    "Solicitação não anônima precisa de usuário");
        }

        if (anonima && dto.getUsuarioId() != null) {
            throw new IllegalArgumentException(
                    "Solicitação anônima não pode ter usuário");
        }
    }

    @Transactional
    public SolicitacaoResponseDTO create(SolicitacaoCreateDTO dto){
        validarAnonimato(dto);
        UsuarioEntity usuario = null;
        boolean anonima = Boolean.TRUE.equals(dto.getAnonima());

        if (!anonima) {
            usuario = usuarioRepository
                    .findById(dto.getUsuarioId())
                    .orElseThrow(() -> new EntityNotFoundException("usuario not found"));
        }

        SolicitacaoEntity entity = SolicitacaoMapper.toEntity(dto, usuario);

        return SolicitacaoMapper.toDTO(solicitacaoRepository.save(entity));
    }

    @Transactional(readOnly = true)
    public List<SolicitacaoResponseDTO> findAll(){
        return solicitacaoRepository.findAll().stream()
                .map(SolicitacaoMapper::toDTO)
                .toList();
    }

    @Transactional(readOnly = true)
    public SolicitacaoResponseDTO findById(Long id){
        return SolicitacaoMapper.toDTO(solicitacaoRepository
                .findById(id).orElseThrow(() -> new EntityNotFoundException("solicitacao not found")));
    }

    @Transactional
    public SolicitacaoResponseDTO update(Long id, SolicitacaoCreateDTO dto){
        validarAnonimato(dto);

        SolicitacaoEntity entity = solicitacaoRepository
                .findById(id)
                .orElseThrow(() -> new EntityNotFoundException("solicitacao not found"));

        UsuarioEntity usuario = null;
        boolean anonima = Boolean.TRUE.equals(dto.getAnonima());

        if (!anonima) {
            usuario = usuarioRepository
                    .findById(dto.getUsuarioId())
                    .orElseThrow(() -> new EntityNotFoundException("usuario not found"));
        }

        SolicitacaoMapper.updateEntity(entity, dto, usuario);

        return SolicitacaoMapper.toDTO(entity);
    }

    @Transactional
    public void delete(Long id){
        if (!solicitacaoRepository.existsById(id)){
            throw new EntityNotFoundException("solicitacao not found");
        }
        solicitacaoRepository.deleteById(id);
    }
}