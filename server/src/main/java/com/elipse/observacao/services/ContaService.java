package com.elipse.observacao.services;

import com.elipse.observacao.dtos.*;
import com.elipse.observacao.entities.CidadaoEntity;
import com.elipse.observacao.repositories.CidadaoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;
import javax.crypto.SecretKeyFactory;
import javax.crypto.spec.PBEKeySpec;
import java.security.MessageDigest;
import java.security.SecureRandom;
import java.util.Base64;

@Service
@RequiredArgsConstructor
public class ContaService {
    private final CidadaoRepository repository;
    private static final int ITERACOES = 210000;

    public ContaResponseDTO cadastrar(CadastroContaDTO dto) {
        var entity = new CidadaoEntity();
        entity.setNome(dto.nome().trim());
        entity.setCpf(dto.cpf());
        entity.setEmail(dto.email().trim());
        entity.setTelefone(dto.telefone());
        byte[] salt = new byte[16];
        new SecureRandom().nextBytes(salt);
        entity.setSenhaHash(Base64.getEncoder().encodeToString(salt) + ":" +
                Base64.getEncoder().encodeToString(derivar(dto.senha(), salt)));
        return resposta(repository.save(entity));
    }

    public ContaResponseDTO entrar(LoginDTO dto) {
        var entity = repository.findByEmail(dto.email().trim()).orElse(null);
        if (entity == null || entity.getSenhaHash() == null) throw naoAutorizado();
        String[] partes = entity.getSenhaHash().split(":");
        boolean confere = partes.length == 2 && MessageDigest.isEqual(
                derivar(dto.senha(), Base64.getDecoder().decode(partes[0])),
                Base64.getDecoder().decode(partes[1]));
        if (!confere) throw naoAutorizado();
        return resposta(entity);
    }

    public ContaResponseDTO consultar(String id) {
        var entity = repository.findById(id).orElseThrow(ContaService::naoAutorizado);
        if (entity.getSenhaHash() == null) throw naoAutorizado();
        return resposta(entity);
    }

    private static byte[] derivar(String senha, byte[] salt) {
        var spec = new PBEKeySpec(senha.toCharArray(), salt, ITERACOES, 256);
        try {
            return SecretKeyFactory.getInstance("PBKDF2WithHmacSHA256").generateSecret(spec).getEncoded();
        } catch (java.security.GeneralSecurityException e) {
            throw new IllegalStateException("Falha ao processar senha", e);
        } finally { spec.clearPassword(); }
    }

    private static ContaResponseDTO resposta(CidadaoEntity entity) {
        return new ContaResponseDTO(entity.getId(), entity.getNome(), entity.getEmail());
    }

    private static ResponseStatusException naoAutorizado() {
        return new ResponseStatusException(HttpStatus.UNAUTHORIZED, "E-mail ou senha invalidos");
    }
}
