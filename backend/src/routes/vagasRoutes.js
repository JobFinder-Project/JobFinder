import express from 'express';
import { isAuthenticated } from '../middlewares/authMiddleware.js';
import VagasController from '../controllers/vagasController.js';

const router = express.Router();

router.use(isAuthenticated);

router.get('/vagas', VagasController.buscarVagas);
router.get('/areas', VagasController.listarAreas);

export default router;
