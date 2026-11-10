package com.elipse.observacao.controllers;

import com.elipse.observacao.dtos.CidadaoCreateDTO;
import com.elipse.observacao.dtos.CidadaoResponseDTO;
import com.elipse.observacao.exceptions.EntityNotFoundException;
import com.elipse.observacao.services.CidadaoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/cidadaos")
@RequiredArgsConstructor
public class CidadaoController {

    private final CidadaoService cidadaoService;

    @ExceptionHandler(DuplicateKeyException.class)
    public ResponseEntity<Void> duplicateEmail() {
        return ResponseEntity.status(409).build();
    }

    @PostMapping
    public ResponseEntity<CidadaoResponseDTO> create(@Valid @RequestBody CidadaoCreateDTO dto) {
        CidadaoResponseDTO response = cidadaoService.create(dto);
        URI uri = ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(response.getId())
                .toUri();
        return ResponseEntity.created(uri).body(response);
    }

    @GetMapping
    public ResponseEntity<List<CidadaoResponseDTO>> findAll() {
        return ResponseEntity.ok(cidadaoService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<CidadaoResponseDTO> findById(@PathVariable String id) {
        try {
            return ResponseEntity.ok(cidadaoService.findById(id));
        } catch (EntityNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<CidadaoResponseDTO> update(
            @PathVariable String id, @Valid @RequestBody CidadaoCreateDTO dto) {
        try {
            return ResponseEntity.ok(cidadaoService.update(id, dto));
        } catch (EntityNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        try {
            cidadaoService.delete(id);
            return ResponseEntity.noContent().build();
        } catch (EntityNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
