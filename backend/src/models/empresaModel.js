import mongoose from 'mongoose';
import { validators } from './globalValidator.js';

const EmpresaSchema = mongoose.Schema({
  nome: {
    type: String,
    required: [true, 'O nome é obrigatório'],
    trim: true,
    minlength: [3, 'O nome deve conter no mínimo 3 caracteres'],
    maxlength: [80, 'O nome deve conter no máximo 80 caracteres'],
    validate: {
      validator: validators.isNome,
      message: 'Nome inválido',
    },
  },
  cnpj: {
    type: String,
    required: [true, 'O CNPJ é obrigatório'],
    unique: true,
    set: (v) => (v ? String(v).replace(/\D/g, '') : v),
    validate: {
      validator: validators.isCNPJ,
      message: 'CNPJ inválido',
    },
  },
  email: {
    type: String,
    required: [true, 'O email é obrigatório'],
    trim: true,
    lowercase: true,
    validate: {
      validator: validators.isEmail,
      message: 'Email inválido',
    },
  },
  senha: {
    type: String,
    required: [true, 'A senha é obrigatória'],
    minlength: [8, 'A senha deve ter no mínimo 8 caracteres'],
  },
  fone: {
    type: String,
    required: [true, 'O telefone é obrigatório'],
    validate: {
      validator: validators.isPhoneBRFormatted,
      message: 'O número de telefone deve seguir o formato (XX) XXXXX-XXXX',
    },
  },
  bio: {
    type: String,
    required: false,
    trim: true,
    maxlength: [500, 'Biografia deve ter no máximo 500 caracteres'],
  },
  site: {
    type: String,
    required: false,
    trim: true,
    validate: {
      validator: validators.isUrlOptional,
      message: 'Site inválido',
    },
  },
  resetToken: {
    type: String,
  },
  resetTokenExpiration: {
    type: Date,
  },
  vagas: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vagas',
    },
  ],
});

export default mongoose.model('Empresa', EmpresaSchema);
