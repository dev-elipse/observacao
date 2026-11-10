package com.elipse.observacao.dtos;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
public class CidadaoCreateDTO {
    @NotBlank
    private String nome;
    @NotBlank
    @Email
    private String email;
    @NotNull
    @Valid
    private List<@NotNull CidadaoEnderecoDTO> enderecos = new ArrayList<>();
}
