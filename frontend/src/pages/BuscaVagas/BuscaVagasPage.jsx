import { useState, useEffect, useRef } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { Navbar } from '../../components'
import { Footer } from '../../components'
import styles from './BuscaVagas.module.css'

function BuscaVagas() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const query = searchParams.get('q') || ''
  
  const [vagas, setVagas] = useState([])
  const [areas, setAreas] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('')
  
  const categoriesRef = useRef(null)

  useEffect(() => {
    fetchVagas()
    fetchAreas()
  }, [query, selectedCategory])

  const fetchVagas = async () => {
    try {
      let url = '/api/vagas'
      const params = new URLSearchParams()
      if (query) params.append('q', query)
      if (selectedCategory) params.append('area', selectedCategory)
      if (params.toString()) url += `?${params.toString()}`

      const response = await fetch(url)
      if (response.ok) {
        const data = await response.json()
        setVagas(data.vagas || [])
      }
    } catch (error) {
      console.error('Erro ao buscar vagas:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchAreas = async () => {
    try {
      const response = await fetch('/api/areas')
      if (response.ok) {
        const data = await response.json()
        setAreas(data || [])
      }
    } catch (error) {
      console.error('Erro ao buscar áreas:', error)
    }
  }

  const scrollCategories = (direction) => {
    if (categoriesRef.current) {
      const scrollAmount = 200
      categoriesRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      })
    }
  }

  const handleCategoryClick = (category) => {
    setSelectedCategory(selectedCategory === category ? '' : category)
  }

  const handleVerVaga = (vagaId) => {
    navigate(`/candidato/vagas/${vagaId}`)
  }

  return (
    <div className={styles.dashboardWrapper}>
      <Navbar inDashboard />
      
      <main className={styles.mainContent}>
        {/* Categories */}
        <div className={styles.categories}>
          <button 
            className={styles.categoryArrow}
            onClick={() => scrollCategories('left')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
              <path d="M11 1.5a.5.5 0 0 1 .5.5v12a.5.5 0 0 1-1 0v-12a.5.5 0 0 1 .5-.5z"/>
              <path d="M4.854 8.354a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 8l2.855 2.854a.5.5 0 1 1-.708.708l-3-3z"/>
            </svg>
          </button>
          
          <div className={styles.categoriesList} ref={categoriesRef}>
            {areas.map((area, index) => (
              <button
                key={index}
                className={`${styles.categoryChip} ${selectedCategory === area ? styles.active : ''}`}
                onClick={() => handleCategoryClick(area)}
              >
                {area}
              </button>
            ))}
          </div>
          
          <button 
            className={styles.categoryArrow}
            onClick={() => scrollCategories('right')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
              <path d="M5 1.5a.5.5 0 0 0-.5.5v12a.5.5 0 0 0 1 0v-12a.5.5 0 0 0-.5-.5z"/>
              <path d="M11.146 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 8l-2.855 2.854a.5.5 0 1 0 .708.708l3-3z"/>
            </svg>
          </button>
        </div>

        {/* Jobs Feed */}
        <div className={styles.jobsFeed}>
          {loading ? (
            <div className={styles.loading}>Carregando vagas...</div>
          ) : vagas.length > 0 ? (
            <ul className={styles.cardGrid}>
              {vagas.map((vaga) => (
                <li key={vaga._id} className={styles.jobCard}>
                  <img 
                    src={vaga.imagem || '/img/default-job.png'} 
                    alt={vaga.nome} 
                    className={styles.jobImage} 
                  />
                  <h2>{vaga.nome}</h2>
                  {vaga.empresa && (
                    <p className={styles.jobCompany}>{vaga.empresa.nome}</p>
                  )}
                  <p className={styles.jobArea}>{vaga.area}</p>
                  <button 
                    className={styles.registerButton}
                    onClick={() => handleVerVaga(vaga._id)}
                  >
                    Ver Vaga
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div className={styles.noData}>
              <p>Não existem vagas cadastradas.</p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default BuscaVagas
