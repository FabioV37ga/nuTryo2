import mongoose from "mongoose";

// Subdocumento para alimentos
const alimentoSchema = new mongoose.Schema({
    _id: { type: String, required: true },        // id do alimento dentro da refeição
    alimento: { type: String, required: true },
    peso: { type: String, required: true },
    calorias: { type: Number, required: true },
    proteinas: { type: Number, required: true },
    carboidratos: { type: Number, required: true },
    gorduras: { type: Number, required: true }
}, { _id: false });

// Subdocumento para refeições
const refeicaoSchema = new mongoose.Schema({
    _id: { type: Number, required: true },  // id da refeição
    tipo: { type: String, required: true }, // Ex: "Almoço", "Lanche da Tarde"
    alimentos: [alimentoSchema]
}, { _id: false });

// Documento principal: refeições de um dia para um usuário
const refeicoesDoDiaSchema = new mongoose.Schema({
    _id: { type: String, required: true },  // id = data do registro, ex: "03-09-25"
    _usuario: { type: String, required: true },
    refeicoes: [refeicaoSchema]
});

const refeicoes = mongoose.model('refeicoes', refeicoesDoDiaSchema);

export { refeicoes };