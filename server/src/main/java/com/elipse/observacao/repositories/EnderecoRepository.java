package com.elipse.observacao.repositories;

import com.elipse.observacao.entities.EnderecoEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EnderecoRepository extends JpaRepository<EnderecoEntity, Long> {
    boolean existsBySolicitacaoId(Long solicitacaoId);
}
