import express from 'express';
import multer from 'multer';
const upload = multer();
import { isAuthenticated, isCandidato } from '../middlewares/authMiddleware.js';
import CandidatoController from '../controllers/candidatoController.js';
import { exigirConsentimentosVigentes } from '../middlewares/consentimentoMiddleware.js';

const router = express.Router();

router.post('/cadastrar', upload.single('imagem'), CandidatoController.cadastrarCandidato);

router.use(isAuthenticated, isCandidato, exigirConsentimentosVigentes);

router.get('/dashboard', CandidatoController.acessarDashboard);
router.put('/editar', upload.single('imagem'), CandidatoController.editarPerfil);
router.delete('/conta', CandidatoController.excluirConta);
router.get('/candidaturas', CandidatoController.listarCandidaturas);
router.post('/vagas/:vagaId', CandidatoController.realizarCandidatura);
router.delete('/candidaturas/delete/:candidaturaId', CandidatoController.deletarCandidatura);

export default router;
