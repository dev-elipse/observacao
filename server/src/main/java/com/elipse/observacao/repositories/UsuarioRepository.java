package com.elipse.observacao.repositories;

import com.elipse.observacao.entities.UsuarioEntity;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface UsuarioRepository extends MongoRepository<UsuarioEntity, String> {
    Optional<UsuarioEntity> findByEmail(String email);
}
