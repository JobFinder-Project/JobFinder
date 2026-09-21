import express from 'express';
import AuthController from '../controllers/authController.js';

const router = express.Router();

router.post('/login', AuthController.login);
router.get('/me', AuthController.getMe);
router.post('/logout', AuthController.logout);
router.post('/recuperar-senha', AuthController.enviarRecuperarSenha);
router.post('/redefinir-senha/:token', AuthController.redefinirSenha);

export default router;
