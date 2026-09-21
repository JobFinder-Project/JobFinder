import express from 'express';
import { isAuthenticated } from '../middlewares/authMiddleware.js';
import VagasController from '../controllers/vagasController.js';

const router = express.Router();

router.get('/vagas', isAuthenticated, VagasController.buscarVagas);
router.get('/areas', isAuthenticated, VagasController.listarAreas);

export default router;
