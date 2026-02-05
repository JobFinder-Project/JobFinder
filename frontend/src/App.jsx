import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

// Pages
import Home from './pages/Home'
import Login from './pages/Login'
import CandidatoDashboard from './pages/CandidatoDashboard'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/candidato/dashboard" element={<CandidatoDashboard />} />
      </Routes>
    </Router>
  )
}

export default App
