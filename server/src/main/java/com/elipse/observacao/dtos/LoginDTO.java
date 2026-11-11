package com.elipse.observacao.dtos;

import jakarta.validation.constraints.*;

public record LoginDTO(@NotBlank @Email String email, @NotBlank @Size(max = 128) String senha) {
}
