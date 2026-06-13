package com.elipse.observacao.dtos;

import com.elipse.observacao.enums.CategoriaSolicitacao;
import com.elipse.observacao.enums.PrioridadeSolicitacao;
import com.elipse.observacao.enums.StatusSolicitacao;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class SolicitacaoCreateDTO {
    @NotNull(message = "categoria must not be null")
    private CategoriaSolicitacao categoria;

    @NotBlank(message = "descricao must not be blank")
    private String descricao;

    private PrioridadeSolicitacao prioridade = PrioridadeSolicitacao.MEDIA;

    private StatusSolicitacao status = StatusSolicitacao.ABERTO;

    private Boolean anonima = false;

    private Long usuarioId;

    private String endereco;
}
