import Vaga from '../models/vagasModel.js';
import { toVagaDTO } from '../dtos/index.js';

class VagasController {
  static async buscarVagas(req, res, next) {
    try {
      const { q, area } = req.query;
      let query = {};

      if (q) {
        query.$or = [
          { nome: { $regex: q, $options: 'i' } },
          { area: { $regex: q, $options: 'i' } },
        ];
      }

      if (area) {
        query.area = area;
      }

      const vagas = await Vaga.find(query).populate('empresa');
      res.status(200).json({ vagas: vagas.map(toVagaDTO) });
    } catch (erro) {
      console.error(erro);
      next(erro);
    }
  }

  static async listarAreas(req, res, next) {
    try {
      const vagas = await Vaga.find({}, 'area');
      const areas = [...new Set(vagas.map((v) => v.area))];
      res.status(200).json(areas);
    } catch (erro) {
      console.error(erro);
      next(erro);
    }
  }
}

export default VagasController;
