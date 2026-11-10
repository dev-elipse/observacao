db = db.getSiblingDB("observacao");

// Pode ser reaplicado em volumes existentes sem apagar documentos.
function aplicarSchema(nome, opcoes) {
    if (db.getCollectionNames().includes(nome)) {
        const resultado = db.runCommand({ collMod: nome, ...opcoes });
        if (!resultado.ok) throw new Error(JSON.stringify(resultado));
    } else {
        db.createCollection(nome, opcoes);
    }
}

aplicarSchema("cidadaos", {
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: ["nome", "email", "enderecos"],
            properties: {
                nome: { bsonType: "string", minLength: 1 },
                email: { bsonType: "string", minLength: 1 },
                enderecos: {
                    bsonType: "array",
                    items: {
                        bsonType: "object",
                        required: ["rua", "numero", "bairro", "cidade", "estado"],
                        properties: {
                            rua: { bsonType: "string", minLength: 1, maxLength: 150 },
                            numero: { bsonType: "string", minLength: 1, maxLength: 20 },
                            bairro: { bsonType: "string", minLength: 1, maxLength: 100 },
                            cidade: { bsonType: "string", minLength: 1 },
                            estado: { bsonType: "string", minLength: 2, maxLength: 2 }
                        }
                    }
                }
            }
        }
    },
    validationLevel: "strict",
    validationAction: "error"
});

// Mesmo nome e opcoes do indice criado pelo @Indexed do backend.
db.cidadaos.createIndex({ email: 1 }, { unique: true, name: "email" });

aplicarSchema("ocorrencias", {
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: ["titulo", "descricao", "categoria", "endereco", "prioridade", "status"],
            properties: {
                titulo: { bsonType: "string", minLength: 1 },
                descricao: { bsonType: "string", minLength: 1 },
                categoria: {
                    enum: ["INFRAESTRUTURA", "ILUMINACAO", "LIMPEZA", "SINALIZACAO", "CALCADA", "ARBORIZACAO", "OUTROS"]
                },
                endereco: {
                    bsonType: "object",
                    required: ["rua", "numero", "bairro"],
                    properties: {
                        rua: { bsonType: "string", minLength: 1 },
                        numero: { bsonType: "string", minLength: 1 },
                        bairro: { bsonType: "string", minLength: 1 }
                    }
                },
                prioridade: { enum: ["BAIXA", "MEDIA", "ALTA"] },
                status: { enum: ["ABERTA", "EM_ANALISE", "EM_ATENDIMENTO", "RESOLVIDA"] },
                cidadaoId: { bsonType: ["string", "null"] },
                historicoStatus: {
                    bsonType: ["array", "null"],
                    items: {
                        bsonType: "object",
                        required: ["status", "data"],
                        properties: {
                            status: { enum: ["ABERTA", "EM_ANALISE", "EM_ATENDIMENTO", "RESOLVIDA"] },
                            data: { bsonType: "date" }
                        }
                    }
                }
            }
        }
    },
    validationLevel: "strict",
    validationAction: "error"
});

db.cidadaos.updateOne(
    { email: "ana.exemplo@example.com" },
    { $setOnInsert: {
        _id: "aep-cidadao-exemplo",
        nome: "Ana Exemplo",
        email: "ana.exemplo@example.com",
        enderecos: [
            { rua: "Rua das Flores", numero: "120", bairro: "Centro", cidade: "Maringa", estado: "PR" },
            { rua: "Avenida Central", numero: "45", bairro: "Jardim America", cidade: "Maringa", estado: "PR" }
        ]
    } },
    { upsert: true }
);
const cidadaoExemplo = db.cidadaos.findOne({ email: "ana.exemplo@example.com" });

const ocorrencias = [
    {
        titulo: "Buraco na Rua das Flores",
        descricao: "Buraco grande próximo ao número 120, risco para veículos.",
        categoria: "INFRAESTRUTURA",
        endereco: { rua: "Rua das Flores", numero: "120", bairro: "Centro" },
        prioridade: "ALTA",
        status: "ABERTA",
        cidadaoId: cidadaoExemplo._id.toString(),
        historicoStatus: []
    },
    {
        titulo: "Lâmpada queimada na praça",
        descricao: "Poste de iluminação apagado há uma semana.",
        categoria: "ILUMINACAO",
        endereco: { rua: "Avenida Central", numero: "45", bairro: "Jardim América" },
        prioridade: "MEDIA",
        status: "EM_ANALISE",
        cidadaoId: cidadaoExemplo._id.toString(),
        historicoStatus: [{ status: "EM_ANALISE", data: ISODate("2026-11-10T12:00:00Z") }]
    },
    {
        titulo: "Lixo acumulado na calçada",
        descricao: "Entulho não recolhido há dias.",
        categoria: "LIMPEZA",
        endereco: { rua: "Rua dos Ipês", numero: "78", bairro: "Vila Nova" },
        prioridade: "BAIXA",
        status: "RESOLVIDA"
    }
];

if (db.ocorrencias.countDocuments() === 0) {
  db.ocorrencias.insertMany(ocorrencias);
}

print("Mongo seed executed successfully.");
