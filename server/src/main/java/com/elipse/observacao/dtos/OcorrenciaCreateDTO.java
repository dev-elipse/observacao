package com.elipse.observacao.dtos;

import com.elipse.observacao.enums.CategoriaOcorrencia;
import com.elipse.observacao.enums.PrioridadeOcorrencia;
import com.elipse.observacao.enums.StatusOcorrencia;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class OcorrenciaCreateDTO {

    @NotBlank(message = "titulo must not be blank")
    private String titulo;

    @NotBlank(message = "descricao must not be blank")
    private String descricao;

    @NotNull(message = "categoria must not be null")
    private CategoriaOcorrencia categoria;

    @NotNull(message = "endereco must not be null")
    @Valid
    private EnderecoDTO endereco;

    private PrioridadeOcorrencia prioridade = PrioridadeOcorrencia.MEDIA;

    private StatusOcorrencia status = StatusOcorrencia.ABERTA;
}
