package com.elipse.observacao.controllers;

import com.elipse.observacao.dtos.OcorrenciaCreateDTO;
import com.elipse.observacao.dtos.OcorrenciaResponseDTO;
import com.elipse.observacao.exceptions.EntityNotFoundException;
import com.elipse.observacao.services.OcorrenciaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/ocorrencias")
@RequiredArgsConstructor
public class OcorrenciaController {

    private final OcorrenciaService ocorrenciaService;

    @PostMapping
    public ResponseEntity<OcorrenciaResponseDTO> create(@Valid @RequestBody OcorrenciaCreateDTO dto) {
        OcorrenciaResponseDTO response = ocorrenciaService.create(dto);
        URI uri = ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(response.getId())
                .toUri();
        return ResponseEntity.created(uri).body(response);
    }

    @GetMapping
    public ResponseEntity<List<OcorrenciaResponseDTO>> findAll() {
        return ResponseEntity.ok(ocorrenciaService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<OcorrenciaResponseDTO> findById(@PathVariable String id) {
        try {
            return ResponseEntity.ok(ocorrenciaService.findById(id));
        } catch (EntityNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<OcorrenciaResponseDTO> update(
            @PathVariable String id, @Valid @RequestBody OcorrenciaCreateDTO dto) {
        try {
            return ResponseEntity.ok(ocorrenciaService.update(id, dto));
        } catch (EntityNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        try {
            ocorrenciaService.delete(id);
            return ResponseEntity.noContent().build();
        } catch (EntityNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
