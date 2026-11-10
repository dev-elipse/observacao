package com.elipse.observacao.entities;

import lombok.Getter;
import lombok.Setter;

/** Endereco embutido no documento do cidadao. */
@Getter
@Setter
public class CidadaoEndereco {
    private String rua;
    private String numero;
    private String bairro;
    private String cidade;
    private String estado;
}
