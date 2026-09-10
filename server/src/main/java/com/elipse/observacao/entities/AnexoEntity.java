package com.elipse.observacao.entities;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.util.UUID;

@Document(collection = "anexos")
@Getter
@Setter
public class AnexoEntity {

   @Id
   private String id = UUID.randomUUID().toString();

   @Indexed(unique = true)
   @Field("url_arquivo")
   private String urlArquivo;

   @DBRef(lazy = true)
   private SolicitacaoEntity solicitacao;
}
