package com.elipse.observacao.dtos;

import com.elipse.observacao.enums.CategoriaSolicitacao;
import com.elipse.observacao.enums.PrioridadeSolicitacao;
import com.elipse.observacao.enums.StatusSolicitacao;
import lombok.Getter;
import lombok.Setter;

import java.time.OffsetDateTime;
import java.util.List;

@Getter
@Setter
public class SolicitacaoResponseDTO {
    private Long id;
    private String endereco;
    private CategoriaSolicitacao categoria;
    private String descricao;
    private PrioridadeSolicitacao prioridade;
    private StatusSolicitacao status;
    private boolean anonima;
    private String nomeUsuario;
    private Long usuarioId;
    private OffsetDateTime createdAt;
    private OffsetDateTime updatedAt;

}
