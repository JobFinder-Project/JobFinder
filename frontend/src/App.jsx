import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

// Pages
import Home from './pages/Home'
import Login from './pages/Login'
import CandidatoDashboard from './pages/CandidatoDashboard'
import EmpresaDashboard from './pages/EmpresaDashboard'
import RegistroCandidato from './pages/RegistroCandidato'
import RegistroEmpresa from './pages/RegistroEmpresa'
import EscolherCargo from './pages/EscolherCargo'
import EsqueciSenha from './pages/EsqueciSenha'
import RedefinirSenha from './pages/RedefinirSenha'
import BuscaVagas from './pages/BuscaVagas'
import BuscaCandidatos from './pages/BuscaCandidatos'
import EditarPerfilCandidato from './pages/EditarPerfilCandidato'
import PaginaErro from './pages/PaginaErro'

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
