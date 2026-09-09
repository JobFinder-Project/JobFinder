import express from 'express';
import multer from 'multer';
import path from 'node:path';
import { isAuthenticated, isEmpresa } from '../middlewares/authMiddleware.js';
import EmpresaController from '../controllers/empresaController.js';
import Error400 from '../errors/Error400.js';

const allowedImageExtensionsByMimeType = {
  'image/svg+xml': ['.svg'],
  'image/png': ['.png'],
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/jpg': ['.jpg', '.jpeg'],
};

const isAllowedVagaImageMetadata = (file) => {
  const allowedExtensions = allowedImageExtensionsByMimeType[file.mimetype];
  const fileExtension = path.extname(file.originalname || '').toLowerCase();

  return Boolean(allowedExtensions?.includes(fileExtension));
};

const upload = multer({
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    if (isAllowedVagaImageMetadata(file)) {
      cb(null, true);
    } else {
      cb(new Error('Formato de arquivo inválido. Apenas SVG, PNG ou JPG são permitidos.'));
    }
  },
});

const uploadImagemVaga = (req, res, next) => {
  upload.single('imagem')(req, res, (erro) => {
    if (!erro) return next();

    if (erro instanceof multer.MulterError && erro.code === 'LIMIT_FILE_SIZE') {
      return next(new Error400('A imagem excede o limite máximo de 10MB.'));
    }

    return next(new Error400(erro.message));
  });
};

const router = express.Router();

router.post('/cadastrar', EmpresaController.cadastrarEmpresa);

router.use(isAuthenticated, isEmpresa);

router.get('/dashboard', EmpresaController.acessarDashboard);
router.put('/editar', EmpresaController.editarPerfil);
router.post('/vagas/criar', uploadImagemVaga, EmpresaController.criarVagas);
router.patch('/vagas/:vagaId/status', EmpresaController.atualizarStatusVaga);
router.get('/candidaturas', EmpresaController.buscarCandidaturas);
router.put('/candidatura/:candidaturaId', EmpresaController.atualizarStatusCandidatura);
router.get('/candidatos/buscar', EmpresaController.buscarCandidatos);

export default router;
