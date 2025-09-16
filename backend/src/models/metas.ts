import mongoose from "mongoose";

const metasSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  metaCalorias: { type: String, default: 2000},
  metaProteinas: { type: String, default: 70},
  metaCarboidratos: { type: String, default: 270},
  metaGorduras: {type: String, default: 55}
});

const metas = mongoose.model("metas", metasSchema)

export default metas