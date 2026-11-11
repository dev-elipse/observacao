package com.elipse.observacao.controllers;

import com.elipse.observacao.dtos.*;
import com.elipse.observacao.services.ContaService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/conta")
@RequiredArgsConstructor
public class ContaController {
    public static final String CIDADAO_SESSAO = "cidadaoId";
    private final ContaService service;

    @PostMapping("/cadastro")
    public ResponseEntity<ContaResponseDTO> cadastrar(@Valid @RequestBody CadastroContaDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.cadastrar(dto));
    }

    @PostMapping("/login")
    public ContaResponseDTO entrar(@Valid @RequestBody LoginDTO dto, HttpServletRequest request) {
        var conta = service.entrar(dto);
        var anterior = request.getSession(false);
        if (anterior != null) anterior.invalidate();
        var session = request.getSession(true);
        session.setAttribute(CIDADAO_SESSAO, conta.id());
        session.setMaxInactiveInterval(1800);
        return conta;
    }

    @GetMapping
    public ContaResponseDTO atual(HttpServletRequest request) {
        var session = request.getSession(false);
        if (session == null || !(session.getAttribute(CIDADAO_SESSAO) instanceof String id)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);
        }
        return service.consultar(id);
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> sair(HttpServletRequest request) {
        var session = request.getSession(false);
        if (session != null) session.invalidate();
        return ResponseEntity.noContent().build();
    }

    @ExceptionHandler(DuplicateKeyException.class)
    public ResponseEntity<Void> emailDuplicado() { return ResponseEntity.status(409).build(); }
}
