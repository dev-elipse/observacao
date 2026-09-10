package com.elipse.observacao.entities;

import com.elipse.observacao.enums.TipoUsuario;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.util.List;
import java.util.UUID;

@Document(collection = "usuarios")
@Getter
@Setter
public class UsuarioEntity {

    @Id
    private String id = UUID.randomUUID().toString();

    @Field("nome")
    @Size(max = 100)
    private String nome;

    @Indexed(unique = true)
    @Field("email")
    @Size(max = 100)
    private String email;

    @Field("numero_telefone")
    @Size(max = 20)
    private String numeroTelefone;

    @Field("cargo")
    @Size(max = 200)
    private String cargo;

    @Field("senha")
    private String senha;

    @Field("tipo")
    private TipoUsuario tipo;

    @DBRef(lazy = true)
    private List<SolicitacaoEntity> solicitacoes;
}