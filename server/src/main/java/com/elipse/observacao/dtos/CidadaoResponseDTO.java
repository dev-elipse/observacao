package com.elipse.observacao.dtos;

import lombok.Getter;
import lombok.Setter;
import java.util.List;

@Getter
@Setter
public class CidadaoResponseDTO {
    private String id;
    private String nome;
    private String cpf;
    private String telefone;
    private String email;
    private List<CidadaoEnderecoDTO> enderecos;
}
