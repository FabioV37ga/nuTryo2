import mongoose from "mongoose";

const metasSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  metaCalorias: { type: Number, default: 2000},
  metaProteinas: { type: Number, default: 70},
  metaCarboidratos: { type: Number, default: 270},
  metaGorduras: {type: Number, default: 55}
});

const metas = mongoose.model("metas", metasSchema)

export default metas