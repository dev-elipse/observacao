package com.elipse.observacao.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "enderecos")
@Getter
@Setter
public class EnderecoEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "logradouro", nullable = false)
    @Size(max = 100)
    private String logradouro;

    @Column(name = "ponto_referencia")
    @Size(max = 100)
    private String pontoReferencia;

    @Column(name = "bairro", nullable = false)
    @Size(max = 50)
    private String bairro;

    @Column(name = "cidade", nullable = false)
    @Size(max = 50)
    private String cidade;

    @Column(name = "cep", nullable = false)
    @Size(max = 20)
    private String cep;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "solicitacao_id", nullable = false, unique = true)
    private SolicitacaoEntity solicitacao;
}