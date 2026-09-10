package com.elipse.observacao.entities;

import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.util.UUID;

@Document(collection = "enderecos")
@Getter
@Setter
public class EnderecoEntity {

   @Id
   private String id = UUID.randomUUID().toString();

   @Field("logradouro")
   @Size(max = 100)
   private String logradouro;

   @Field("ponto_referencia")
   @Size(max = 100)
   private String pontoReferencia;

   @Field("bairro")
   @Size(max = 50)
   private String bairro;

   @Field("cidade")
   @Size(max = 50)
   private String cidade;

   @Field("cep")
   @Size(max = 20)
   private String cep;

   @DBRef(lazy = true)
   private SolicitacaoEntity solicitacao;
}