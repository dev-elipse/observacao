package com.elipse.observacao.controllers;

import com.elipse.observacao.dtos.SolicitacaoCreateDTO;
import com.elipse.observacao.dtos.SolicitacaoResponseDTO;
import com.elipse.observacao.services.SolicitacaoService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/solicitacoes")
@RequiredArgsConstructor
public class SolicitacaoController {

    private final SolicitacaoService solicitacaoService;

    @PostMapping
    public ResponseEntity<SolicitacaoResponseDTO> create(@Valid @RequestBody SolicitacaoCreateDTO dto){
        try{
            SolicitacaoResponseDTO response = solicitacaoService.create(dto);
            URI uri = ServletUriComponentsBuilder.fromCurrentRequest().path("/{id}").buildAndExpand(response.getId()).toUri();
            return ResponseEntity.created(uri).body(response);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping
    public ResponseEntity<List<SolicitacaoResponseDTO>> findAll(){
            List<SolicitacaoResponseDTO> response = solicitacaoService.findAll();
            return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<SolicitacaoResponseDTO> findById(@PathVariable Long id){
        try {
            SolicitacaoResponseDTO response = solicitacaoService.findById(id);
            return ResponseEntity.ok(response);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<SolicitacaoResponseDTO> update(@PathVariable Long id, @Valid @RequestBody SolicitacaoCreateDTO dto){
        try {
            SolicitacaoResponseDTO response = solicitacaoService.update(id, dto);
            return ResponseEntity.ok(response);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id){
        try {
            solicitacaoService.delete(id);
            return ResponseEntity.ok().build();
        } catch (EntityNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }
}