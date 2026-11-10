package com.elipse.observacao.entities;

import com.elipse.observacao.enums.CategoriaOcorrencia;
import com.elipse.observacao.enums.PrioridadeOcorrencia;
import com.elipse.observacao.enums.StatusOcorrencia;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.time.OffsetDateTime;
import java.util.UUID;

/** Documento de ocorrencia com referencia opcional a cidadao. */
@Document(collection = "ocorrencias")
@Getter
@Setter
public class OcorrenciaEntity {

    @Id
    private String id = UUID.randomUUID().toString();

    @Field("titulo")
    private String titulo;

    @Field("descricao")
    private String descricao;

    @Field("categoria")
    private CategoriaOcorrencia categoria;

    @Field("endereco")
    private Endereco endereco;

    @Field("prioridade")
    private PrioridadeOcorrencia prioridade = PrioridadeOcorrencia.MEDIA;

    @Field("status")
    private StatusOcorrencia status = StatusOcorrencia.ABERTA;

    @Field("created_at")
    private OffsetDateTime createdAt;

    @Field("updated_at")
    private OffsetDateTime updatedAt;

    private String cidadaoId;

    public void prePersist() {
        this.createdAt = OffsetDateTime.now();
        this.updatedAt = OffsetDateTime.now();
    }

    public void preUpdate() {
        this.updatedAt = OffsetDateTime.now();
    }
}
