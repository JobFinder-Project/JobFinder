import express from 'express';
import multer from 'multer';
const upload = multer();
import { isAuthenticated, isCandidato } from '../middlewares/authMiddleware.js';
import CandidatoController from '../controllers/candidatoController.js';

const router = express.Router();

router.post('/cadastrar', upload.single('imagem'), CandidatoController.cadastrarCandidato);

router.use(isAuthenticated, isCandidato);

router.get('/dashboard', CandidatoController.acessarDashboard);
router.put('/editar', upload.single('imagem'), CandidatoController.editarPerfil);
router.get('/candidaturas', CandidatoController.listarCandidaturas);
router.post('/vagas/:vagaId', CandidatoController.realizarCandidatura);
router.delete('/candidaturas/delete/:candidaturaId', CandidatoController.deletarCandidatura);

export default router;
