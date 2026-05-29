package com.elipse.observacao.repositories;

import com.elipse.observacao.entities.AnexoEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AnexoRepository extends JpaRepository<AnexoEntity, Long> {
    boolean existsByUrlArquivo(String urlArquivo);
}
