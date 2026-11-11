package com.elipse.observacao.repositories;

import com.elipse.observacao.entities.OcorrenciaEntity;
import com.elipse.observacao.enums.CategoriaOcorrencia;
import com.elipse.observacao.enums.StatusOcorrencia;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface OcorrenciaRepository extends MongoRepository<OcorrenciaEntity, String> {
    List<OcorrenciaEntity> findByStatus(StatusOcorrencia status);
    List<OcorrenciaEntity> findByCategoria(CategoriaOcorrencia categoria);
}
