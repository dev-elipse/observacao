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
                if (semContato) {
                    throw new IllegalArgumentException(
                            "Cidadão deve ter pelo menos e-mail ou telefone.");
                }
                if (dto.getCargo() != null) {
                    throw new IllegalArgumentException(
                            "Cidadão não deve ter cargo.");
                }
            }
            case GESTOR, FUNCIONARIO_PUBLICO -> {
                if (dto.getCargo() == null || dto.getCargo().isBlank()) {
                    throw new IllegalArgumentException(
                            "Gestor e Funcionário Público devem ter cargo.");
                }
                if (dto.getEmail() == null || dto.getEmail().isBlank()) {
                    throw new IllegalArgumentException(
                            "Gestor e Funcionário Público devem ter e-mail.");
                }
            }
        }
    }

    @Transactional
    public UsuarioDTO create(UsuarioDTO dto) {
        validarUsuario(dto);
        UsuarioEntity entity = UsuarioMapper.toEntity(dto);
        return UsuarioMapper.toDTO(usuarioRepository.save(entity));
    }

    @Transactional(readOnly = true)
    public List<UsuarioDTO> findAll() {
        return usuarioRepository.findAll().stream()
                .map(UsuarioMapper::toDTO)
                .toList();
    }

    @Transactional(readOnly = true)
    public UsuarioDTO findById(Long id) {
        return UsuarioMapper.toDTO(usuarioRepository
                .findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Usuário não encontrado")));
    }

    @Transactional(readOnly = true)
    public UsuarioDTO findByEmail(String email) {
        return UsuarioMapper.toDTO(usuarioRepository
                .findByEmail(email)
                .orElseThrow(() -> new EntityNotFoundException("Usuário não encontrado")));
    }

    @Transactional(readOnly = true)
    public boolean validarSenha(String email, String senha) {
        UsuarioEntity entity = usuarioRepository
                .findByEmail(email)
                .orElseThrow(() -> new EntityNotFoundException("Usuário não encontrado"));
        return senha != null && senha.equals(entity.getSenha());
    }

    @Transactional
    public UsuarioDTO update(Long id, UsuarioDTO dto) {
        validarUsuario(dto);
        UsuarioEntity entity = usuarioRepository
                .findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Usuário não encontrado"));
        UsuarioMapper.updateEntity(entity, dto);
        return UsuarioMapper.toDTO(entity);
    }

    @Transactional
    public void delete(Long id) {
        if (!usuarioRepository.existsById(id)) {
            throw new EntityNotFoundException("Usuário não encontrado");
        }
        usuarioRepository.deleteById(id);
    }
}