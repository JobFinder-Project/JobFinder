import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate, Link } from 'react-router-dom'
import styles from './BuscaCandidatos.module.css'

function BuscaCandidatos() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const query = searchParams.get('q') || ''
  
  const [candidatos, setCandidatos] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState(query)

  useEffect(() => {
    if (query) {
      fetchCandidatos()
    } else {
      setLoading(false)
    }
  }, [query])

  const fetchCandidatos = async () => {
    try {
      const response = await fetch(`/api/empresa/candidatos/buscar?q=${encodeURIComponent(query)}`)
      if (response.ok) {
        const data = await response.json()
        setCandidatos(data.candidatos || data || [])
      }
    } catch (error) {
      console.error('Erro ao buscar candidatos:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      navigate(`/empresa/candidatos/buscar?q=${encodeURIComponent(searchTerm)}`)
    }
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/logout')
      navigate('/login')
    } catch (error) {
      console.error('Erro ao fazer logout:', error)
      navigate('/login')
    }
  }

  return (
    <div className={styles.page}>
      <nav className={styles.navbar}>
        <h1>JobFinder</h1>
        <ul className={styles.navbarMenu}>
          <li>
            <button onClick={handleLogout} className={styles.logoutButton}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path fillRule="evenodd" d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0z" />
                <path fillRule="evenodd" d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708z" />
              </svg>
            </button>
          </li>
        </ul>
      </nav>

      {/* Search Bar */}
      <div className={styles.searchContainer}>
        <Link to="/empresa/dashboard" className={styles.backButton}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path fillRule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8"/>
          </svg>
          Voltar
        </Link>
        
        <form onSubmit={handleSearch} className={styles.searchForm}>
          <span className={styles.searchIcon}>🔍</span>
          <input
            type="text"
            name="q"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
            placeholder="Buscar Candidatos"
          />
          <button type="submit" className={styles.searchButton}>Buscar</button>
        </form>
        
        <div></div>
      </div>

      <div className={styles.container}>
        {/* Header */}
        <div className={styles.headerSection}>
          <h1>Resultados da Busca:</h1>
          {query && <p>Termo buscado: "{query}"</p>}
        </div>

        {/* Candidates Grid */}
        <div className={styles.candidatesGrid}>
          {loading ? (
            <div className={styles.loading}>Carregando candidatos...</div>
          ) : candidatos.length > 0 ? (
            candidatos.map((candidato) => (
              <div key={candidato._id} className={styles.candidateCard}>
                {candidato.imagem && (
                  <img
                    src={candidato.imagem}
                    alt={candidato.nome}
                    className={styles.candidateImage}
                  />
                )}
                <h2>{candidato.nome}</h2>
                <p>{candidato.qualificacao}</p>
                <p>{candidato.educacao}</p>
                <button className={styles.viewProfileButton}>
                  Ver Perfil
                </button>
              </div>
            ))
          ) : (
            <div className={styles.noData}>
              <p>Nenhum candidato encontrado{query ? ` para "${query}"` : ''}.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default BuscaCandidatos
