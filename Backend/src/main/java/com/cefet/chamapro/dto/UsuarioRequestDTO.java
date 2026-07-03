package com.cefet.chamapro.dto;

import java.util.Date;

import com.cefet.chamapro.entity.Endereco;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record UsuarioRequestDTO(
        //@NotBlank(message = "O campo usuarioId é obrigatório")
        String usuarioId,

        @NotBlank(message = "Nome é obrigatório")
        String nome,

        @NotBlank(message = "Email é obrigatório")
        @Email(message = "Email inválido")
        String email,

        @NotBlank(message = "Senha é obrigatória")
        String senha,

        @NotBlank(message = "CPF é obrigatório")
        String cpf,

        @NotNull(message = "Data de nascimento é obrigatória")
        Date dtNasc,

        Double nota,

        EnderecoRequestDTO endereco,

        @NotBlank(message = "Tipo é obrigatório")
        String tipo
) {}