import express from 'express';
import { isAuthenticated } from '../middlewares/authMiddleware.js';
import VagasController from '../controllers/vagasController.js';
import { exigirConsentimentosVigentes } from '../middlewares/consentimentoMiddleware.js';

const router = express.Router();

router.use(isAuthenticated, exigirConsentimentosVigentes);

router.get('/vagas', VagasController.buscarVagas);
router.get('/areas', VagasController.listarAreas);

export default router;
