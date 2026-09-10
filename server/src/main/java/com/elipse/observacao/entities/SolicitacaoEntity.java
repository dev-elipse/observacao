package com.elipse.observacao.entities;

import com.elipse.observacao.enums.CategoriaSolicitacao;
import com.elipse.observacao.enums.PrioridadeSolicitacao;
import com.elipse.observacao.enums.StatusSolicitacao;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.time.OffsetDateTime;
import java.util.UUID;

@Document(collection = "solicitacoes")
@Getter
@Setter
public class SolicitacaoEntity {

    @Id
    private String id = UUID.randomUUID().toString();

    @Field("categoria")
    private CategoriaSolicitacao categoria;

    @Field("descricao")
    private String descricao;

    @Field("prioridade")
    private PrioridadeSolicitacao prioridade = PrioridadeSolicitacao.MEDIA;

    @Field("status")
    private StatusSolicitacao status = StatusSolicitacao.ABERTO;

    @Field("anonima")
    private boolean anonima;

    @Field("endereco")
    private String endereco;

    @DBRef(lazy = true)
    private UsuarioEntity usuario;

    @Field("created_at")
    private OffsetDateTime createdAt;

    @Field("updated_at")
    private OffsetDateTime updatedAt;

    public void prePersist() {
        this.createdAt = OffsetDateTime.now();
        this.updatedAt = OffsetDateTime.now();
    }

    public void preUpdate() {
        this.updatedAt = OffsetDateTime.now();
    }
}