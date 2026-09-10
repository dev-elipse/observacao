package com.elipse.observacao.repositories;

import com.elipse.observacao.entities.EnderecoEntity;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface EnderecoRepository extends MongoRepository<EnderecoEntity, String> {
    boolean existsBySolicitacaoId(String solicitacaoId);
}
