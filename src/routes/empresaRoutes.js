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
router.get('/perfil', async (req, res) => {
    try {
        const empresa = req.user;
        res.json({
            success: true,
            empresa: {
                _id: empresa._id,
                nome: empresa.nome,
                cnpj: empresa.cnpj,
                email: empresa.email,
                fone: empresa.fone,
                bio: empresa.bio || '',
                site: empresa.site || ''
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Erro ao buscar perfil da empresa' });
    }
});
router.get("/:empresaId/editar", visualizarTelaEdicaoEmpre);
router.post("/:empresaId/editar", updateEmpresa);
router.delete("/excluir/:id", deleteEmpresa);
router.get('/candidatos/buscar', buscarCandidatos);
router.post('/:empresaId/vagas/criar', upload.single('imagem'), criarVaga);
router.get('/:empresaId/candidaturas', getCandidaturas)
router.get('/:empresaId/can/:id', visualizarCandidatos)
router.post('/candidaturas/:id/status', updateStatus)

module.exports = router;