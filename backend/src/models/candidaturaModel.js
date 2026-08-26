import mongoose from 'mongoose';

// Definição do modelo de uma Candidatura
const candidaturaSchema = new mongoose.Schema(
  {
    candidato: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Candidato',
      required: [true, 'O candidato é obrigatório'],
    },
    vaga: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vagas',
      required: [true, 'A vaga é obrigatória'],
    },
    empresa: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Empresa',
      required: [true, 'A empresa é obrigatória'],
    },
    status: {
      type: String,
      enum: {
        values: ['Pendente', 'Aceita', 'Rejeitada'],
        message: 'O status {VALUE} é inválido',
      },
      default: 'Pendente',
    },
  },
  {
    timestamps: true,
  }
);

candidaturaSchema.index({ candidato: 1, vaga: 1 }, { unique: true });

export default mongoose.model('Candidatura', candidaturaSchema);
