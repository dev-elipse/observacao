package com.elipse.observacao.dtos;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AnexoDTO {
    private String id;

    @NotBlank(message = "urlArquivo must not be blank")
    private String urlArquivo;

    @NotBlank(message = "solicitacaoId must not be blank")
    private String solicitacaoId;
}