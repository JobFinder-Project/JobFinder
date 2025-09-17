const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer();
const { isAuthenticated, isCandidato } = require('../middleware/auth');
const { dashboardCandidato, getPerfilCandidato, getCadastroCandidato, cadastrarCandidato, verVaga,candidatarAVaga, buscarVagas, verCandidatura, cancelarCandidatura, updatePerfil } = require('../controller/candidatoController');
const {visualizarCandidaturas, visualizarTelaEdicaoCand} = require('../controller/telasController')

// Rotas do candidato
router.get('/dashboard', isAuthenticated, isCandidato, dashboardCandidato);
router.get("/perfil/:candidatoId", getPerfilCandidato);
router.get("/cadastrar", getCadastroCandidato);
router.post("/cadastrar", upload.single('imagem'), cadastrarCandidato);
router.get('/vagas/buscar', buscarVagas);
router.get("/vagas/:id", verVaga);
router.post("/:candidatoId/vagas/:id", candidatarAVaga);
router.get("/candidaturas", isAuthenticated, isCandidato, verCandidatura);
router.post('/:candidatoId/vagas/delete/:candidaturaId', cancelarCandidatura)
router.get('/:candidatoId/candidaturas', visualizarCandidaturas)
router.get('/perfil/:candidatoId/editar', visualizarTelaEdicaoCand);
router.post('/perfil/:candidatoId/editar', upload.single('imagem'),updatePerfil);

module.exports = router;