import express from 'express';
import ConsentimentoController from '../controllers/consentimentoController.js';
import { isAuthenticated } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/consentimentos/aceitar', isAuthenticated, ConsentimentoController.aceitar);

export default router;
