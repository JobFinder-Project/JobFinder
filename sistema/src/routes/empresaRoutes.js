const express = require("express");
const router = express.Router();
const multer = require('multer');
const upload = multer();
const { getCandidaturas, visualizarCandidatos, visualizarTelaEdicaoEmpre} = require('../controller/telasController')
const { getCadastroEmpresa, createEmpresa, updateEmpresa, deleteEmpresa, dashboardEmpresa, criarVaga, updateStatus, buscarCandidatos } = require("../controller/empresaController");
const { isAuthenticated, isEmpresa } = require('../middleware/auth');

// Rotas da empresa
router.get("/cadastrar", getCadastroEmpresa);
router.post("/cadastrar", createEmpresa);

router.use(isAuthenticated, isEmpresa);

router.get('/dashboard', dashboardEmpresa);
router.get("/:empresaId/editar", visualizarTelaEdicaoEmpre);
router.post("/:empresaId/editar", updateEmpresa);
router.delete("/excluir/:id", deleteEmpresa);
router.get('/candidatos/buscar', buscarCandidatos);
router.post('/:empresaId/vagas/criar', upload.single('imagem'), criarVaga);
router.get('/:empresaId/candidaturas', getCandidaturas)
router.get('/:empresaId/can/:id', visualizarCandidatos)
router.post('/candidaturas/:id/status', updateStatus)

module.exports = router;