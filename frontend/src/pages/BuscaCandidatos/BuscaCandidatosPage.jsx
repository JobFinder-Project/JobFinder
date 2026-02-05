import { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import NavbarEmpresa from '../../components/Navbar/NavbarEmpresa/NavbarEmpresa'
import { empresaService } from '../../services'
import styles from './BuscaCandidatos.module.css'

function BuscaCandidatos() {
  const [searchParams] = useSearchParams()
  const query = searchParams.get('q') || ''
  
  const [candidatos, setCandidatos] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (query) {
      fetchCandidatos()
    } else {
      setLoading(false)
    }
  }, [query])

  const fetchCandidatos = async () => {
    try {
      const data = await empresaService.buscarCandidatos(query)
      setCandidatos(data.candidatos || data || [])
    } catch (error) {
      console.error('Erro ao buscar candidatos:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.page}>
      <NavbarEmpresa initialSearchValue={query} />

      {/* Back Button and Info */}
      <div className={styles.headerBar}>
        <Link to="/empresa/dashboard" className={styles.backButton}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path fillRule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8"/>
          </svg>
          Voltar ao Dashboard
        </Link>
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
