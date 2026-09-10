db = db.getSiblingDB('observacao');

const usuarios = [
  {
    _id: 'usr-01',
    nome: 'Maria Silva',
    email: 'maria.silva@email.com',
    numero_telefone: '(11) 99999-1111',
    cargo: null,
    senha: '123456',
    tipo: 'CIDADAO'
  },
  {
    _id: 'usr-02',
    nome: 'João Pereira',
    email: 'joao.pereira@prefeitura.gov.br',
    numero_telefone: null,
    cargo: 'Analista de Obras',
    senha: 'admin123',
    tipo: 'FUNCIONARIO_PUBLICO'
  },
  {
    _id: 'usr-03',
    nome: 'Ana Costa',
    email: 'ana.costa@prefeitura.gov.br',
    numero_telefone: null,
    cargo: 'Gestora de Serviços Urbanos',
    senha: 'gestor123',
    tipo: 'GESTOR'
  }
];

if (db.usuarios.countDocuments() === 0) {
  db.usuarios.insertMany(usuarios);
}

const solicitacoes = [
  {
    _id: 'sol-01',
    categoria: 'INFRAESTRUTURA_URBANA',
    descricao: 'Buraco na rua principal em frente à escola municipal, com risco de acidentes para pedestres e veículos.',
    prioridade: 'ALTA',
    status: 'ABERTO',
    anonima: false,
    endereco: 'Rua das Flores, 45 - Centro',
    usuario: { $ref: 'usuarios', $id: 'usr-01' },
    created_at: new Date('2026-09-01T09:15:00-03:00'),
    updated_at: new Date('2026-09-01T09:15:00-03:00')
  },
  {
    _id: 'sol-02',
    categoria: 'LIMPEZA_URBANA',
    descricao: 'Acumulado de resíduos na praça central após coleta irregular e odor forte no entorno.',
    prioridade: 'MEDIA',
    status: 'TRIAGEM',
    anonima: true,
    endereco: 'Praça da Bandeira, s/n - Bairro Novo',
    usuario: null,
    created_at: new Date('2026-09-03T15:40:00-03:00'),
    updated_at: new Date('2026-09-03T16:10:00-03:00')
  },
  {
    _id: 'sol-03',
    categoria: 'ILUMINACAO_PUBLICA',
    descricao: 'Poste de iluminação apagado há três noites no trecho da avenida principal.',
    prioridade: 'URGENTE',
    status: 'EM_EXECUCAO',
    anonima: false,
    endereco: 'Avenida Brasil, 320 - Vila Operária',
    usuario: { $ref: 'usuarios', $id: 'usr-02' },
    created_at: new Date('2026-09-05T08:00:00-03:00'),
    updated_at: new Date('2026-09-06T11:20:00-03:00')
  }
];

if (db.solicitacoes.countDocuments() === 0) {
  db.solicitacoes.insertMany(solicitacoes);
}

const enderecos = [
  {
    _id: 'end-01',
    logradouro: 'Rua das Flores',
    ponto_referencia: 'Em frente à escola municipal',
    bairro: 'Centro',
    cidade: 'São Paulo',
    cep: '01000-000',
    solicitacao: { $ref: 'solicitacoes', $id: 'sol-01' }
  },
  {
    _id: 'end-02',
    logradouro: 'Praça da Bandeira',
    ponto_referencia: 'Ao lado do mercado municipal',
    bairro: 'Bairro Novo',
    cidade: 'São Paulo',
    cep: '01010-010',
    solicitacao: { $ref: 'solicitacoes', $id: 'sol-02' }
  },
  {
    _id: 'end-03',
    logradouro: 'Avenida Brasil',
    ponto_referencia: 'Próximo ao posto de saúde',
    bairro: 'Vila Operária',
    cidade: 'São Paulo',
    cep: '01020-030',
    solicitacao: { $ref: 'solicitacoes', $id: 'sol-03' }
  }
];

if (db.enderecos.countDocuments() === 0) {
  db.enderecos.insertMany(enderecos);
}

const anexos = [
  {
    _id: 'anx-01',
    url_arquivo: 'https://example.com/uploads/sol-01/foto-1.jpg',
    solicitacao: { $ref: 'solicitacoes', $id: 'sol-01' }
  },
  {
    _id: 'anx-02',
    url_arquivo: 'https://example.com/uploads/sol-02/foto-2.jpg',
    solicitacao: { $ref: 'solicitacoes', $id: 'sol-02' }
  }
];

if (db.anexos.countDocuments() === 0) {
  db.anexos.insertMany(anexos);
}

print('Mongo seed executed successfully');
