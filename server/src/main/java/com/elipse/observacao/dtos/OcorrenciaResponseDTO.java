package com.elipse.observacao.dtos;

import com.elipse.observacao.enums.CategoriaOcorrencia;
import com.elipse.observacao.enums.PrioridadeOcorrencia;
import com.elipse.observacao.enums.StatusOcorrencia;
import lombok.Getter;
import lombok.Setter;

import java.time.OffsetDateTime;

@Getter
@Setter
public class OcorrenciaResponseDTO {

    private String id;
    private String titulo;
    private String descricao;
    private CategoriaOcorrencia categoria;
    private EnderecoDTO endereco;
    private PrioridadeOcorrencia prioridade;
    private StatusOcorrencia status;
    private OffsetDateTime createdAt;
    private OffsetDateTime updatedAt;
}
