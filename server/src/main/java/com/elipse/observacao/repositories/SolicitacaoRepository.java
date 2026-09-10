package com.elipse.observacao.repositories;

import com.elipse.observacao.entities.SolicitacaoEntity;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface SolicitacaoRepository extends MongoRepository<SolicitacaoEntity, String> {
}
