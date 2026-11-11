async function main() {
    // Execute com mongosh --quiet tests/mongo-init.test.js na raiz do projeto.
    // Usa um banco temporario exclusivo; nao altera o banco observacao.
    const fs = require("fs");
    const assert = require("assert");
    const nomeTeste = "observacao_teste_" + new ObjectId().toString();
    const bancoTeste = db.getSiblingDB(nomeTeste);
    const fonte = fs.readFileSync(process.env.MONGO_INIT_SCRIPT || "mongo-init.js", "utf8");
    assert(fonte.includes('db.getSiblingDB("observacao")'));
    const arquivoTeste = require("path").join(require("os").tmpdir(), nomeTeste + ".js");
    const script = fonte.replace('db.getSiblingDB("observacao")', `db.getSiblingDB("${nomeTeste}")`);
    async function rejeitar(acao, codigo) {
        let falha;
        try { await acao(); } catch (erro) { falha = erro; }
        assert(falha, "A operacao invalida deveria ser rejeitada");
        assert.strictEqual(falha.code, codigo);
    }
    fs.writeFileSync(arquivoTeste, script);
    try {
        await load(arquivoTeste);
        const cidadao = await bancoTeste.cidadaos.findOne({ email: "ana.exemplo@example.com" });
        assert.strictEqual(cidadao.enderecos.length, 2);
        assert.strictEqual(await bancoTeste.ocorrencias.countDocuments(), 3);
        assert.strictEqual(await bancoTeste.ocorrencias.countDocuments({ cidadaoId: cidadao._id }), 2);
        const historico = (await bancoTeste.ocorrencias.findOne({ status: "EM_ANALISE" })).historicoStatus;
        assert(historico[0].data instanceof Date);
        await rejeitar(() => bancoTeste.cidadaos.insertOne({ ...cidadao, _id: "duplicado" }), 11000);
        await rejeitar(() => bancoTeste.cidadaos.insertOne({ nome: "Invalido", email: "invalido@example.com", enderecos: [{}] }), 121);
        await rejeitar(() => bancoTeste.cidadaos.insertOne({ nome: "Invalido", email: "invalido@example.com", enderecos: null }), 121);
        const antiga = await bancoTeste.ocorrencias.findOne({ status: "RESOLVIDA" });
        assert.strictEqual(antiga.cidadaoId, undefined);
        await bancoTeste.ocorrencias.updateOne({ _id: antiga._id }, { $set: { titulo: "Titulo preservado" } });
        await rejeitar(() => bancoTeste.ocorrencias.updateOne({ _id: antiga._id }, { $set: { cidadaoId: 123 } }), 121);
        await rejeitar(() => bancoTeste.ocorrencias.updateOne({ _id: antiga._id }, { $set: { historicoStatus: [{ status: "INVALIDO", data: new Date() }] } }), 121);
        await rejeitar(() => bancoTeste.ocorrencias.updateOne({ _id: antiga._id }, { $set: { historicoStatus: [{ status: "ABERTA", data: "2026-11-10" }] } }), 121);
        await bancoTeste.ocorrencias.updateOne({ _id: antiga._id }, { $set: { cidadaoId: null, historicoStatus: [] } });
        // Simula o validator antigo em um volume existente e reaplica o script.
        await bancoTeste.runCommand({ collMod: "ocorrencias", validator: {} });
        await load(arquivoTeste);
        assert.strictEqual(await bancoTeste.cidadaos.countDocuments(), 1);
        assert.strictEqual(await bancoTeste.ocorrencias.countDocuments(), 3);
        assert.strictEqual((await bancoTeste.ocorrencias.findOne({ _id: antiga._id })).titulo, "Titulo preservado");
        await rejeitar(() => bancoTeste.ocorrencias.updateOne({ _id: antiga._id }, { $set: { cidadaoId: 123 } }), 121);
        print("PASS: schemas, indice unico, vinculos, datas BSON e reaplicacao sem perda de dados.");
    } finally {
        assert(nomeTeste.startsWith("observacao_teste_"));
        await bancoTeste.dropDatabase();
        fs.unlinkSync(arquivoTeste);
    }

}
main().catch(erro => { print(erro.stack); quit(1); });
