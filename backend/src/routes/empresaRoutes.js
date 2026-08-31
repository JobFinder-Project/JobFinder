import express from 'express';
import multer from 'multer';
import { isAuthenticated, isEmpresa } from '../middlewares/authMiddleware.js';
import EmpresaController from '../controllers/empresaController.js';

const upload = multer({
  limits: {
    fileSize: 10 * 1024 * 1024
  },
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = ['image/svg+xml', 'image/png', 'image/jpeg', 'image/jpg'];
    
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Formato de arquivo inválido. Apenas SVG, PNG ou JPG são permitidos.'));
    }
  }
});

const router = express.Router();

router.post('/cadastrar', EmpresaController.cadastrarEmpresa);

router.use(isAuthenticated, isEmpresa);

router.get('/dashboard', EmpresaController.acessarDashboard);
router.put('/editar', EmpresaController.editarPerfil);
router.post('/vagas/criar', upload.single('imagem'), EmpresaController.criarVagas);
router.patch('/vagas/:vagaId/status', EmpresaController.atualizarStatusVaga);
router.get('/candidaturas', EmpresaController.buscarCandidaturas);
router.put('/candidatura/:candidaturaId', EmpresaController.atualizarStatusCandidatura);
router.get('/candidatos/buscar', EmpresaController.buscarCandidatos);

export default router;