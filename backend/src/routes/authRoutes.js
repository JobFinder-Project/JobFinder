import express from 'express';
import AuthController from '../controllers/authController.js';

const router = express.Router();

router.post('/login', AuthController.login);
router.get('/me', AuthController.getMe);
router.get('/logout', AuthController.logout);
router.post('/recuperar_senha', AuthController.enviarRecuperarSenha);
router.post('/redefinir_senha/:token', AuthController.redefinirSenha);

export default router;
