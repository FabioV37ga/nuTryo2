import mongoose from "mongoose";

const refeicoesSchema = new mongoose.Schema({
    id: { type: mongoose.Schema.Types.ObjectId },
}, { versionKey: false });

const refeicoes = mongoose.model('refeicoes', refeicoesSchema);

export { refeicoes, refeicoesSchema };