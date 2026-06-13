package com.elipse.observacao.entities;

import com.elipse.observacao.enums.TipoUsuario;
import jakarta.persistence.*;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import java.util.List;

@Entity
@Table(name = "usuarios")
@Getter
@Setter
public class UsuarioEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "nome", nullable = false)
    @Size(max = 100)
    private String nome;

    @Column(name = "email", unique = true)
    @Size(max = 100)
    private String email;

    @Column(name = "numero_telefone")
    @Size(max = 20)
    private String numeroTelefone;

    @Column(name = "cargo")
    @Size(max = 200)
    private String cargo;

    @Column(name = "senha")
    private String senha;

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo", nullable = false)
    private TipoUsuario tipo;

    @OneToMany(mappedBy = "usuario", fetch = FetchType.LAZY)
    private List<SolicitacaoEntity> solicitacoes;
}