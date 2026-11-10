package com.elipse.observacao.entities;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Document(collection = "cidadaos")
@Getter
@Setter
public class CidadaoEntity {
    @Id
    private String id = UUID.randomUUID().toString();
    private String nome;
    @Indexed(unique = true)
    private String email;
    private List<CidadaoEndereco> enderecos = new ArrayList<>();
}
