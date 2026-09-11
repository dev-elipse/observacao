package com.elipse.observacao.entities;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Objeto de valor embutido no documento da ocorrência (não é uma coleção à parte).
 * Mantém a coleção "ocorrencias" única, conforme exigido na 1ª Entrega da AEP.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Endereco {

    private String rua;
    private String numero;
    private String bairro;
}
