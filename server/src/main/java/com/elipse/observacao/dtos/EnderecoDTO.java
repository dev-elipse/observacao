package com.elipse.observacao.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class EnderecoDTO {
       private Long id;

       @NotBlank(message = "logradouro must not be blank")
       @Size(max = 100, message = "logradouro must be at most 100 characters")
       private String logradouro;

       @Size(max = 100, message = "ponto_referencia must be at most 100 characters")
       private String pontoReferencia;

       @NotBlank(message = "bairro must not be blank")
       @Size(max = 50, message = "bairro must be at most 100 characters")
       private String bairro;

       @NotBlank(message = "cidade must not be blank")
       @Size(max = 50, message = "cidade must be at most 100 characters")
       private String cidade;

       @NotBlank(message = "cep must not be blank")
       @Size(max = 20, message = "cep must be at most 100 characters")
       private String cep;

       @NotNull(message = "solicitacaoId must not be null")
       private Long solicitacaoId;
}