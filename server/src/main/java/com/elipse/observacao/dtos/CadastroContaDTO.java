package com.elipse.observacao.dtos;

import jakarta.validation.constraints.*;

public record CadastroContaDTO(
        @NotBlank String nome,
        @NotBlank @Pattern(regexp = "[0-9]{11}") String cpf,
        @NotBlank @Email String email,
        @NotBlank @Pattern(regexp = "[0-9]{10,11}") String telefone,
        @NotBlank @Size(min = 8, max = 128) String senha) {
}
