import { useState, useEffect, useRef } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { BiChevronLeft, BiChevronRight } from 'react-icons/bi'
import Navbar from '../../components/Navbar/Navbar'
import Footer from '../../components/Footer/Footer'
import { vagasService } from '../../services/vagasService'
import styles from './BuscaVagas.module.css'

export default function BuscaVagas() {
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
      const data = await vagasService.buscar({ q: query, area: selectedCategory })
      setVagas(data || [])
    } catch (error) {
      console.error('Erro ao buscar vagas:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchAreas = async () => {
    try {
      const data = await vagasService.getAreas()
      setAreas(data || [])
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
            <BiChevronLeft size={18} />
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
            <BiChevronRight size={18} />
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