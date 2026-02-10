import { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { BiArrowBack } from 'react-icons/bi'
import Navbar from '../../components/Navbar/Navbar'
import { empresaService } from '../../services/empresaService'
import styles from './BuscaCandidatos.module.css'

export default function BuscaCandidatos() {
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

  const handleNewSearch = (newTerm) => {
    setSearchParams({ q: newTerm });
  };

  return (
    <div className={styles.page}>
      <Navbar initialSearchValue={query} customSearchHandler={handleNewSearch} />

      <div className={styles.headerBar}>
<Link to="/empresa/dashboard" className={styles.backButton}>
          <BiArrowBack size={16} />
          Voltar ao Dashboard
        </Link>
      </div>

      <div className={styles.container}>

        <div className={styles.headerSection}>
          <h1>Resultados da Busca:</h1>
          {query && <p>Termo buscado: "{query}"</p>}
        </div>

        
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
