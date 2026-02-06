import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import AuthProvider from './contexts/AuthContext'
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute'

const queryClient = new QueryClient()

import GuestRoute from './components/GuestRoute/GuestRoute'

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
    <QueryClientProvider client={queryClient}>
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <AuthProvider>
          <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          
          {/* Guest Only Routes (redireciona se já logado) */}
          <Route path="/login" element={
            <GuestRoute>
              <Login />
            </GuestRoute>
          } />
          <Route path="/cargo" element={
            <GuestRoute>
              <EscolherCargo />
            </GuestRoute>
          } />
          <Route path="/candidato/cadastrar" element={
            <GuestRoute>
              <RegistroCandidato />
            </GuestRoute>
          } />
          <Route path="/empresa/cadastrar" element={
            <GuestRoute>
              <RegistroEmpresa />
            </GuestRoute>
          } />
          <Route path="/esqueci-senha" element={<EsqueciSenha />} />
          <Route path="/redefinir-senha/:token" element={<RedefinirSenha />} />

          {/* Protected Candidato Routes */}
          <Route path="/candidato/dashboard" element={
            <ProtectedRoute allowedRole="candidato">
              <CandidatoDashboard />
            </ProtectedRoute>
          } />
          <Route path="/candidato/vagas" element={
            <ProtectedRoute allowedRole="candidato">
              <BuscaVagas />
            </ProtectedRoute>
          } />
          <Route path="/candidato/perfil/:candidatoId/editar" element={
            <ProtectedRoute allowedRole="candidato">
              <EditarPerfilCandidato />
            </ProtectedRoute>
          } />

          {/* Protected Empresa Routes */}
          <Route path="/empresa/dashboard" element={
            <ProtectedRoute allowedRole="empresa">
              <EmpresaDashboard />
            </ProtectedRoute>
          } />
          <Route path="/empresa/candidatos/buscar" element={
            <ProtectedRoute allowedRole="empresa">
              <BuscaCandidatos />
            </ProtectedRoute>
          } />

          {/* 404 */}
          <Route path="*" element={<PaginaErro />} />
        </Routes>
        </AuthProvider>
      </Router>
    </QueryClientProvider>
  )
}

export default App
