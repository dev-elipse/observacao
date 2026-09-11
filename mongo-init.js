db = db.getSiblingDB("observacao");

db.createCollection("ocorrencias", {
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
                status: { enum: ["ABERTA", "EM_ANALISE", "EM_ATENDIMENTO", "RESOLVIDA"] }
            }
        }
    },
    validationLevel: "strict",
    validationAction: "error"
});

const ocorrencias = [
    {
        titulo: "Buraco na Rua das Flores",
        descricao: "Buraco grande próximo ao número 120, risco para veículos.",
        categoria: "INFRAESTRUTURA",
        endereco: { rua: "Rua das Flores", numero: "120", bairro: "Centro" },
        prioridade: "ALTA",
        status: "ABERTA"
    },
    {
        titulo: "Lâmpada queimada na praça",
        descricao: "Poste de iluminação apagado há uma semana.",
        categoria: "ILUMINACAO",
        endereco: { rua: "Avenida Central", numero: "45", bairro: "Jardim América" },
        prioridade: "MEDIA",
        status: "EM_ANALISE"
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
