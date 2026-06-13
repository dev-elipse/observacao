package com.elipse.observacao.dtos;

import com.elipse.observacao.enums.TipoUsuario;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UsuarioDTO {
    private Long id;

    @NotBlank(message = "nome must not be blank")
    @Size(max = 100, message = "nome must be at most 100 characters")
    private String nome;

    @Size(max = 100, message = "email must be at most 100 characters")
    private String email;

    @Size(max = 20, message = "numeroTelefone must be at most 20 characters")
    private String numeroTelefone;

    @Size(max = 200, message = "cargo must be at most 200 characters")
    private String cargo;

    @NotNull(message = "tipo must not be null")
    private TipoUsuario tipo;

    private String senha;
}