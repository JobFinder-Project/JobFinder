const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer();
const { isAuthenticated, isCandidato} = require('../middleware/auth');
const { dashboardCandidato, getCadastroCandidato, cadastrarCandidato, verVaga,candidatarAVaga, buscarVagas, verCandidatura, cancelarCandidatura, updatePerfil } = require('../controller/candidatoController');
const { visualizarTelaEdicaoCand, getCandidaturas} = require('../controller/telasController')

// Rotas do candidato
router.get("/cadastrar", getCadastroCandidato);
router.post("/cadastrar", upload.single('imagem'), cadastrarCandidato);

router.use(isAuthenticated, isCandidato);

router.get('/dashboard', dashboardCandidato);
router.get('/vagas/buscar', buscarVagas);
router.get("/vagas/:id", verVaga);
router.post("/:candidatoId/vagas/:id", candidatarAVaga);
router.get("/candidaturas", getCandidaturas);
router.post('/:candidatoId/vagas/delete/:candidaturaId', cancelarCandidatura)
router.get('/perfil/:candidatoId/editar', visualizarTelaEdicaoCand);
router.post('/perfil/:candidatoId/editar', upload.single('imagem'),updatePerfil);

module.exports = router;