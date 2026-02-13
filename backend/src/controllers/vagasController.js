import Vaga from '../models/vagasModel.js';

class VagasController {
  static async buscarVagas(req, res) {
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

      const vagasFormatadas = vagas.map((v) => {
        let imagemBase64 = null;
        if (v.imagem && v.imagem.data) {
          imagemBase64 = `data:${v.imagem.contentType};base64,${v.imagem.data.toString('base64')}`;
        }
        return { ...v._doc, imagem: imagemBase64 };
      });

      res.json({ vagas: vagasFormatadas });
    } catch (erro) {
      console.error(erro);
      res.status(500).json({ error: 'Erro ao buscar vagas' });
    }
  }

  static async listarAreas(req, res) {
    try {
      const vagas = await Vaga.find({}, 'area');
      const areas = [...new Set(vagas.map((v) => v.area))];
      res.json(areas);
    } catch (erro) {
      console.error(erro);
      res.status(500).json({ error: 'Erro ao buscar áreas' });
    }
  }
}

export default VagasController;
