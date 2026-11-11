package com.elipse.observacao.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class EnderecoDTO {

    @NotBlank(message = "rua must not be blank")
    @Size(max = 150, message = "rua must be at most 150 characters")
    private String rua;

    @NotBlank(message = "numero must not be blank")
    @Size(max = 20, message = "numero must be at most 20 characters")
    private String numero;

    @NotBlank(message = "bairro must not be blank")
    @Size(max = 100, message = "bairro must be at most 100 characters")
    private String bairro;
}
