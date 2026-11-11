package com.elipse.observacao.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CidadaoEnderecoDTO {
    @NotBlank
    @Size(max = 150)
    private String rua;
    @NotBlank
    @Size(max = 20)
    private String numero;
    @NotBlank
    @Size(max = 100)
    private String bairro;
    @NotBlank
    private String cidade;
    @NotBlank
    @Size(min = 2, max = 2)
    private String estado;
}
