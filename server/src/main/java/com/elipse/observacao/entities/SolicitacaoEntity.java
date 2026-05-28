package com.elipse.observacao.entities;

import com.elipse.observacao.enums.CategoriaSolicitacao;
import com.elipse.observacao.enums.PrioridadeSolicitacao;
import com.elipse.observacao.enums.StatusSolicitacao;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.OffsetDateTime;
import java.util.List;

@Entity
@Table(name = "solicitacoes", schema = "observacao_db")
@Getter
@Setter
public class SolicitacaoEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @JdbcTypeCode(SqlTypes.NAMED_ENUM)
    @Column(name = "categoria", nullable = false, columnDefinition = "categoria_solicitacao")
    private CategoriaSolicitacao categoria;

    @Column(name = "descricao", nullable = false, columnDefinition = "TEXT")
    private String descricao;

    @Enumerated(EnumType.STRING)
    @JdbcTypeCode(SqlTypes.NAMED_ENUM)
    @Column(name = "prioridade", nullable = false, columnDefinition = "prioridade_solicitacao")
    private PrioridadeSolicitacao prioridade = PrioridadeSolicitacao.MEDIA;

    @Enumerated(EnumType.STRING)
    @JdbcTypeCode(SqlTypes.NAMED_ENUM)
    @Column(name = "status", nullable = false, columnDefinition = "status_solicitacao")
    private StatusSolicitacao status = StatusSolicitacao.ABERTO;

    @Column(name = "anonima", nullable = false)
    private boolean anonima;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id")
    private UsuarioEntity usuario;

    @Column(name = "created_at", nullable = false, insertable = false, updatable = false)
    private OffsetDateTime createdAt;

    @Column(name = "updated_at", nullable = false, insertable = false, updatable = false)
    private OffsetDateTime updatedAt;
}