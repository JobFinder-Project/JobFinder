import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

// Pages
import Home from './pages/Home'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </Router>
  )
}

export default App
