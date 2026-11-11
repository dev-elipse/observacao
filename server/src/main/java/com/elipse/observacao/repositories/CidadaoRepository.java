package com.elipse.observacao.repositories;

import com.elipse.observacao.entities.CidadaoEntity;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface CidadaoRepository extends MongoRepository<CidadaoEntity, String> {
}
