package com.elipse.observacao.repositories;

import com.elipse.observacao.entities.AnexoEntity;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface AnexoRepository extends MongoRepository<AnexoEntity, String> {
    boolean existsByUrlArquivo(String urlArquivo);
    boolean existsBySolicitacaoId(String solicitacaoId);
}
