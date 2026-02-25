import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import AuthProvider from './contexts/AuthContext'
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute'
import GuestRoute from './components/GuestRoute/GuestRoute'

import SignupPage from './pages/Signup/SignupPage';
import GestaoCandidaturasPage from './pages/GestaoCandidaturas/GestaoCandidaturasPage';
import SuportePage from './pages/Suporte/SuportePage';

import Home from './pages/Home/HomePage'
import Login from './pages/Login/LoginPage'
import GerenciarVagasPage from './pages/GerenciarVagas/GerenciarVagasPage';
import CandidatoDashboard from './pages/CandidatoDashboard/CandidatoDashboardPage'
import EmpresaDashboard from './pages/EmpresaDashboard/EmpresaDashboardPage'
import EsqueciSenha from './pages/EsqueciSenha/EsqueciSenhaPage'
import RedefinirSenha from './pages/RedefinirSenha/RedefinirSenhaPage'
import BuscaVagas from './pages/BuscaVagas/BuscaVagasPage'
import BuscaCandidatos from './pages/BuscaCandidatos/BuscaCandidatosPage'
import EditarPerfilCandidato from './pages/EditarPerfilCandidato/EditarPerfilCandidatoPage'
import PaginaErro from './pages/PaginaErro/PaginaErroPage'

const queryClient = new QueryClient()

function App() {
  return (
      <QueryClientProvider client={queryClient}>
        <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <AuthProvider>
            <Routes>
              <Route path='/' element={<Home />} />
              <Route path='/home' element={<Home />} />

              <Route path='/login' element={
                <GuestRoute>
                  <Login />
                </GuestRoute>
              } />

              <Route path='/candidato/cadastrar' element={
                <GuestRoute>
                  <SignupPage />
                </GuestRoute>
              } />
              <Route path='/empresa/cadastrar' element={
                <GuestRoute>
                  <SignupPage />
                </GuestRoute>
              } />

              <Route path='/recuperar_senha' element={<EsqueciSenha />} />
              <Route path='/redefinir-senha/:token' element={<RedefinirSenha />} />

              {/* Candidato Routes */}
              <Route path='/candidato/dashboard' element={
                <ProtectedRoute allowedRole='candidato'>
                  <CandidatoDashboard />
                </ProtectedRoute>
              } />
              <Route path='/candidato/vagas' element={
                <ProtectedRoute allowedRole='candidato'>
                  <BuscaVagas />
                </ProtectedRoute>
              } />
              <Route path='/candidato/perfil/:candidatoId/editar' element={
                <ProtectedRoute allowedRole='candidato'>
                  <EditarPerfilCandidato />
                </ProtectedRoute>
              } />

              {/* Empresa Routes */}
              <Route path='/empresa/vagas' element={
                <ProtectedRoute allowedRole='empresa'>
                  <GerenciarVagasPage />
                </ProtectedRoute>
              } />
              <Route path='/empresa/dashboard' element={
                <ProtectedRoute allowedRole='empresa'>
                  <EmpresaDashboard />
                </ProtectedRoute>
              } />
              <Route path='/empresa/candidatos/buscar' element={
                <ProtectedRoute allowedRole='empresa'>
                  <BuscaCandidatos />
                </ProtectedRoute>
              } />
              <Route path="/empresa/candidaturas" element={
                <ProtectedRoute allowedRole="empresa">
                  <GestaoCandidaturasPage />
                </ProtectedRoute>
              } />
              <Route path="/empresa/suporte" element={
                <ProtectedRoute allowedRole="empresa">
                  <SuportePage />
                </ProtectedRoute>
              } />

              {/* 404 */}
              <Route path='*' element={<PaginaErro />} />
            </Routes>
          </AuthProvider>
        </Router>
      </QueryClientProvider>
  )
}

export default App