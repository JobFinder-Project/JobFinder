import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

// Pages
import Home from './pages/Home/HomePage'
import Login from './pages/Login/LoginPage'
import CandidatoDashboard from './pages/CandidatoDashboard/CandidatoDashboardPage'
import EmpresaDashboard from './pages/EmpresaDashboard/EmpresaDashboardPage'
import RegistroCandidato from './pages/RegistroCandidato/RegistroCandidatoPage'
import RegistroEmpresa from './pages/RegistroEmpresa/RegistroEmpresaPage'
import EscolherCargo from './pages/EscolherCargo/EscolherCargoPage'
import EsqueciSenha from './pages/EsqueciSenha/EsqueciSenhaPage'
import RedefinirSenha from './pages/RedefinirSenha/RedefinirSenhaPage'
import BuscaVagas from './pages/BuscaVagas/BuscaVagasPage'
import BuscaCandidatos from './pages/BuscaCandidatos/BuscaCandidatosPage'
import EditarPerfilCandidato from './pages/EditarPerfilCandidato/EditarPerfilCandidatoPage'
import PaginaErro from './pages/PaginaErro/PaginaErroPage'

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cargo" element={<EscolherCargo />} />
        <Route path="/esqueci-senha" element={<EsqueciSenha />} />
        <Route path="/redefinir-senha/:token" element={<RedefinirSenha />} />

        {/* Candidato Routes */}
        <Route path="/candidato/cadastrar" element={<RegistroCandidato />} />
        <Route path="/candidato/dashboard" element={<CandidatoDashboard />} />
        <Route path="/candidato/vagas" element={<BuscaVagas />} />
        <Route path="/candidato/perfil/:candidatoId/editar" element={<EditarPerfilCandidato />} />

        {/* Empresa Routes */}
        <Route path="/empresa/cadastrar" element={<RegistroEmpresa />} />
        <Route path="/empresa/dashboard" element={<EmpresaDashboard />} />
        <Route path="/empresa/candidatos/buscar" element={<BuscaCandidatos />} />

        {/* 404 */}
        <Route path="*" element={<PaginaErro />} />
      </Routes>
    </Router>
  )
}

export default App
