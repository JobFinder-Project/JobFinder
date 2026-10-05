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
  slug: {
    type: String,
    required: false,
    trim: true,
    lowercase: true,
    unique: true,
    sparse: true,
    maxlength: [120, 'Slug deve ter no máximo 120 caracteres'],
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
  segmento: {
    type: String,
    required: false,
    trim: true,
    maxlength: [120, 'Segmento deve ter no máximo 120 caracteres'],
  },
  localizacao: {
    type: String,
    required: false,
    trim: true,
    maxlength: [120, 'Localização deve ter no máximo 120 caracteres'],
  },
  tamanhoEmpresa: {
    type: String,
    required: false,
    trim: true,
    enum: {
      values: [
        '',
        '1-10 colaboradores',
        '11-50 colaboradores',
        '51-200 colaboradores',
        '201-500 colaboradores',
        '501+ colaboradores',
      ],
      message: 'Tamanho de empresa inválido',
    },
  },
  anoFundacao: {
    type: Number,
    required: false,
    min: [1800, 'Ano de fundação inválido'],
    max: [new Date().getFullYear(), 'Ano de fundação não pode ser futuro'],
  },
  missao: {
    type: String,
    required: false,
    trim: true,
    maxlength: [600, 'Missão deve ter no máximo 600 caracteres'],
  },
  valores: {
    type: [String],
    default: [],
  },
  beneficios: {
    type: [String],
    default: [],
  },
  resetToken: {
    type: String,
  },
  resetTokenExpiration: {
    type: Date,
  },
  termosUsoAceitoEm: {
    type: Date,
  },
  termosUsoVersao: {
    type: String,
  },
  politicaPrivacidadeAceitaEm: {
    type: Date,
  },
  politicaPrivacidadeVersao: {
    type: String,
  },
  vagas: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vagas',
    },
  ],
});

export default mongoose.model('Empresa', EmpresaSchema);
