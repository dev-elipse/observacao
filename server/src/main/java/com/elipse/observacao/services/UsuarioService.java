package com.elipse.observacao.services;


import com.elipse.observacao.dtos.UsuarioDTO;
import com.elipse.observacao.entities.UsuarioEntity;
import com.elipse.observacao.mappers.UsuarioMapper;
import com.elipse.observacao.repositories.UsuarioRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;

    private void validarUsuario(UsuarioDTO dto) {

        switch (dto.getTipo()) {

            case CIDADAO -> {
                boolean semContato =
                        dto.getEmail() == null && dto.getNumeroTelefone() == null;

                if(semContato){
                    throw new IllegalArgumentException(
                            "cidadao must have at least one contact");
                }

                if (dto.getCargo() != null) {
                    throw new IllegalArgumentException(
                            "cidadao must not have a cargo");
                }
            }

            case GESTOR, FUNCIONARIO_PUBLICO -> {

                if (dto.getCargo() == null) {
                    throw new IllegalArgumentException(
                            "gestor and funcionario must have a cargo");
                }

                if (dto.getEmail() == null) {
                    throw new IllegalArgumentException(
                            "gestor and funcionario must have a email");
                }
            }
        }
    }

    @Transactional
    public UsuarioDTO create(UsuarioDTO dto){
        validarUsuario(dto);

        UsuarioEntity entity = UsuarioMapper.toEntity(dto);
        return UsuarioMapper.toDTO(usuarioRepository.save(entity));
    }

    @Transactional(readOnly = true)
    public List<UsuarioDTO> findAll(){
        return usuarioRepository.findAll().stream()
                .map(UsuarioMapper::toDTO)
                .toList();
    }

    @Transactional(readOnly = true)
    public UsuarioDTO findById(Long id){
        return UsuarioMapper.toDTO(usuarioRepository
                .findById(id).orElseThrow(() -> new EntityNotFoundException("usuario not found")));
    }

    @Transactional
    public UsuarioDTO update(Long id, UsuarioDTO dto){
        validarUsuario(dto);

        UsuarioEntity entity = usuarioRepository
                .findById(id)
                .orElseThrow(() -> new EntityNotFoundException("usuario not found"));

        UsuarioMapper.updateEntity(entity, dto);
        return UsuarioMapper.toDTO(entity);
    }

    @Transactional
    public void delete(Long id){
        if (!usuarioRepository.existsById(id)){
            throw new EntityNotFoundException("usuario not found");
        }
        usuarioRepository.deleteById(id);
    }
}
