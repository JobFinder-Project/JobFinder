import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

// Pages
import Home from './pages/Home'
import Login from './pages/Login'
import CandidatoDashboard from './pages/CandidatoDashboard'
import EmpresaDashboard from './pages/EmpresaDashboard'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/candidato/dashboard" element={<CandidatoDashboard />} />
        <Route path="/empresa/dashboard" element={<EmpresaDashboard />} />
      </Routes>
    </Router>
  )
}

export default App
