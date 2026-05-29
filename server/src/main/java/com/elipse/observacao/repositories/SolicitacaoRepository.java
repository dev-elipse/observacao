package com.elipse.observacao.repositories;

import com.elipse.observacao.entities.SolicitacaoEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SolicitacaoRepository extends JpaRepository<SolicitacaoEntity, Long> {
}
