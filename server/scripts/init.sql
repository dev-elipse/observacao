create schema observacao_db;
SET search_path TO observacao_db;

create type categoria_solicitacao as ENUM (
    'INFRAESTRUTURA_URBANA',
    'ILUMINACAO_PUBLICA',
    'LIMPEZA_URBANA',
    'MEIO_AMBIENTE',
    'TRANSITO_MOBILIDADE',
    'SAUDE_PUBLICA',
    'EDUCACAO',
    'SEGURANCA_PUBLICA',
    'OBRAS_PUBLICAS',
    'SANEAMENTO',
    'SERVICOS_PUBLICOS',
    'OUTROS'
);

create type prioridade_solicitacao as ENUM (
    'BAIXA',
    'MEDIA',
    'ALTA',
    'URGENTE'
);

create type status_solicitacao as ENUM (
    'ABERTO',
    'TRIAGEM',
    'EM_EXECUCAO',
    'RESOLVIDO',
    'ENCERRADO'
);

create type tipo_usuario as ENUM (
    'CIDADAO',
    'FUNCIONARIO_PUBLICO',
    'GESTOR'
);

create table usuarios (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE,
    numero_telefone VARCHAR(20) UNIQUE,
    cargo VARCHAR(200),
    tipo tipo_usuario NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT chk_cargo_usuario
        CHECK(
            (tipo = 'CIDADAO' AND (numero_telefone IS NOT NULL OR email IS NOT NULL) AND cargo IS NULL)
            OR
            (tipo = 'FUNCIONARIO_PUBLICO' AND cargo IS NOT NULL AND email IS NOT NULL)
            OR
            (tipo = 'GESTOR' AND cargo IS NOT NULL AND email IS NOT NULL)
        )
);

create table solicitacoes (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    categoria categoria_solicitacao NOT NULL,
    descricao TEXT NOT NULL,
    prioridade prioridade_solicitacao DEFAULT 'MEDIA',
    status status_solicitacao DEFAULT 'ABERTO',
    anonima boolean DEFAULT FALSE,
    usuario_id INT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (usuario_id) REFERENCES usuarios(id),

    CONSTRAINT chk_usuario_anonimo
        CHECK (
            (anonima = TRUE AND usuario_id IS NULL)
            OR
            (anonima = FALSE AND usuario_id IS NOT NULL)
        )
);

create table historico_solicitacoes (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    solicitacao_id INT NOT NULL,
    status status_solicitacao NOT NULL,
    comentario TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    responsavel_id INT NOT NULL,

    FOREIGN KEY (solicitacao_id) REFERENCES solicitacoes(id),
    FOREIGN KEY (responsavel_id) REFERENCES usuarios(id)
    ON DELETE CASCADE
);

create table anexos (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    solicitacao_id INT NOT NULL,
    url_arquivo TEXT NOT NULL UNIQUE,

    FOREIGN KEY (solicitacao_id) REFERENCES solicitacoes(id)
    ON DELETE CASCADE
);

create table enderecos (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    solicitacao_id INT NOT NULL UNIQUE,
    logradouro VARCHAR(100) NOT NULL,
    ponto_referencia VARCHAR(100),
    bairro VARCHAR(50) NOT NULL,
    cidade VARCHAR(50) NOT NULL,
    cep VARCHAR(20) NOT NULL,

    FOREIGN KEY (solicitacao_id) REFERENCES solicitacoes(id)
    ON DELETE CASCADE
);

create index idx_solicitacoes_usuario
on solicitacoes(usuario_id);

create index idx_solicitacoes_status
on solicitacoes(status);

create index idx_solicitacoes_categoria
on solicitacoes(categoria);

CREATE INDEX idx_solicitacoes_created_at
ON solicitacoes(created_at);

CREATE INDEX idx_solicitacoes_status_categoria
ON solicitacoes(status, categoria);

create index idx_historico_solicitacao
on historico_solicitacoes(solicitacao_id);

create index idx_anexos_solicitacao
on anexos(solicitacao_id);

create or replace function atualizar_updated_at()
returns trigger as $$
begin
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
end;
$$ language plpgsql;

create trigger trg_atualizar_updated_at_solicitacoes
before update on solicitacoes
for each row
execute function atualizar_updated_at();

create trigger trg_atualizar_updated_at_usuarios
before update on usuarios
for each row
execute function atualizar_updated_at();