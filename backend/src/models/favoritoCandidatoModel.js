import mongoose from 'mongoose';

const FavoritoCandidatoSchema = mongoose.Schema(
  {
    empresa: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Empresa',
      required: true,
      index: true,
    },
    candidato: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Candidato',
      required: true,
      index: true,
    },
  },
  { timestamps: true }
);

FavoritoCandidatoSchema.index({ empresa: 1, candidato: 1 }, { unique: true });

export default mongoose.model('FavoritoCandidato', FavoritoCandidatoSchema);
