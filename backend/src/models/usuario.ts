import mongoose from "mongoose";

const usuarioSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  senha: { type: String, required: true },
  nome: { type: String}
});

const Usuario = mongoose.model("usuarios", usuarioSchema);

export default Usuario;