import mongoose from 'mongoose'
import VagasSchema from "./vagasModel.js";

const EmpresaSchema = mongoose.Schema({
  nome: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        return /^[a-zA-Zá-ú0-9\-\s]+$/.test(v);
      },
      message: 'Nome inválido'
    },
  },
  cnpj: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function (v) {
        return /^\d{14}$/.test(v); 
      },
      message: 'CNPJ inválido'
    }
  },
  email: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        return /\S+@\S+\.\S+/.test(v);
      },
      message: 'Email inválido'
    }
  },
  senha: {
    type: String,
    required: true,
    minlength: 8
  },
  fone: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        
        return /^\d{10,11}$/.test(v);
      },
      message: 'Telefone inválido'
    }
  },
  bio: {
    type: String,
    required: false,
  },
  site: {
    type: String,
    required: false,
  },
  resetToken: {
    type: String
  },
  resetTokenExpiration: {
    type: Date
  },
  vagas: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vagas'
  }]

});

export default mongoose.model("Empresa", EmpresaSchema);