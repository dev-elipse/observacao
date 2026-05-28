package com.elipse.observacao.entities;

import com.elipse.observacao.enums.TipoUsuario;
import jakarta.persistence.*;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.OffsetDateTime;
import java.util.List;

@Entity
@Table(name = "usuarios", schema = "observacao_db")
@Getter
@Setter
public class UsuarioEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "nome", nullable = false)
    @Size(max = 100)
    private String nome;

    @Column(name = "email")
    @Size(max = 100)
    private String email;

    @Column(name = "numero_telefone")
    @Size(max = 20)
    private String numeroTelefone;

    @Column(name = "cargo")
    @Size(max = 200)
    private String cargo;

    @Enumerated(EnumType.STRING)
    @JdbcTypeCode(SqlTypes.NAMED_ENUM)
    @Column(name = "tipo", nullable = false, columnDefinition = "tipo_usuario")
    private TipoUsuario tipo;

    @OneToMany(mappedBy = "usuario", fetch = FetchType.LAZY)
    private List<SolicitacaoEntity> solicitacoes;

    @Column(name = "created_at", nullable = false, insertable = false, updatable = false)
    private OffsetDateTime createdAt;

    @Column(name = "updated_at", nullable = false, insertable = false, updatable = false)
    private OffsetDateTime updatedAt;
}