package com.elipse.observacao.controllers;

import com.elipse.observacao.dtos.AnexoDTO;
import com.elipse.observacao.services.AnexoService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/anexos")
@RequiredArgsConstructor
public class AnexoController {

    private final AnexoService anexoService;

    @PostMapping
    public ResponseEntity<AnexoDTO> create(@Valid @RequestBody AnexoDTO dto){
        try {
            AnexoDTO response = anexoService.create(dto);
            return ResponseEntity.ok(response);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping
    public ResponseEntity<List<AnexoDTO>> findAll() {
        List<AnexoDTO> response = anexoService.findAll();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<AnexoDTO> findById(@PathVariable Long id){
        try {
            AnexoDTO response = anexoService.findById(id);
            return ResponseEntity.ok(response);
        } catch (EntityNotFoundException e){
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<AnexoDTO> update(@PathVariable Long id, @RequestBody AnexoDTO dto) {
        try{
            AnexoDTO response = anexoService.update(id, dto);
            return ResponseEntity.ok(response);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id){
        try {
            anexoService.delete(id);
            return ResponseEntity.noContent().build();
        } catch (EntityNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
