package com.elipse.observacao.controllers;

import com.elipse.observacao.dtos.LoginRequestDTO;
import com.elipse.observacao.dtos.LoginResponseDTO;
import com.elipse.observacao.dtos.UsuarioDTO;
import com.elipse.observacao.services.UsuarioService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UsuarioService usuarioService;

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> login(@RequestBody LoginRequestDTO request) {
        try {
            UsuarioDTO usuario = usuarioService.findByEmail(request.getEmail());

            boolean senhaCorreta = usuarioService.validarSenha(request.getEmail(), request.getSenha());
            if (!senhaCorreta) {
                return ResponseEntity.status(401).build();
            }

            String token = "Bearer_" + UUID.randomUUID();
            return ResponseEntity.ok(new LoginResponseDTO(usuario, token));
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/register")
    public ResponseEntity<LoginResponseDTO> register(@RequestBody UsuarioDTO usuarioDTO) {
        try {
            UsuarioDTO novoUsuario = usuarioService.create(usuarioDTO);
            String token = "Bearer_" + UUID.randomUUID();
            return ResponseEntity.ok(new LoginResponseDTO(novoUsuario, token));
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout() {
        return ResponseEntity.ok().build();
    }

    @GetMapping("/me")
    public ResponseEntity<UsuarioDTO> getCurrentUser() {
        return ResponseEntity.ok().build();
    }
}