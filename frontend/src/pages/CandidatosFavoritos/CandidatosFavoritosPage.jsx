import { useEffect, useState } from 'react'
import { BiHeart, BiSearch } from 'react-icons/bi'
import { Link } from 'react-router-dom'
import DashboardLayout from '../../components/Layout/DashboardLayout/DashboardLayout'
import CandidateCard from '../../features/candidato/CandidateCard'
import { empresaService } from '../../services/empresaService'
import styles from './CandidatosFavoritos.module.css'

export default function CandidatosFavoritosPage() {
  const [candidatos, setCandidatos] = useState([])
  const [loading, setLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState('')
  const [favoriteLoadingId, setFavoriteLoadingId] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    let isMounted = true

    const carregarFavoritos = async () => {
      setLoading(true)
      setErrorMsg('')

      try {
        const data = await empresaService.listarCandidatosFavoritos()
        if (isMounted) setCandidatos(data.candidatos || [])
      } catch (error) {
        if (isMounted) {
          setCandidatos([])
          setErrorMsg(error.message || 'Não foi possível carregar os candidatos favoritos.')
        }
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    carregarFavoritos()

    return () => {
      isMounted = false
    }
  }, [])

  const handleToggleFavorito = async (candidato) => {
    if (!candidato?.id || favoriteLoadingId) return

    setFavoriteLoadingId(candidato.id)
    setErrorMsg('')

    try {
      await empresaService.desfavoritarCandidato(candidato.id)
      setCandidatos((current) => current.filter((item) => item.id !== candidato.id))
    } catch (error) {
      setErrorMsg(error.message || 'Não foi possível remover o candidato dos favoritos.')
    } finally {
      setFavoriteLoadingId('')
    }
  }

  const termoBusca = searchTerm.trim().toLowerCase()
  const candidatosFiltrados = termoBusca
    ? candidatos.filter((candidato) => candidato.nome?.toLowerCase().includes(termoBusca))
    : candidatos

  return (
    <DashboardLayout userType="employer">
      <div className={styles.container}>
        <div className={styles.pageHeader}>
          <div>
            <h1 className={styles.pageTitle}>Candidatos favoritos</h1>
            <p className={styles.pageSubtitle}>
              Acompanhe os perfis salvos pela empresa para retomar a avaliação depois.
            </p>
          </div>
          <form
            className={styles.searchForm}
            role="search"
            onSubmit={(event) => event.preventDefault()}
          >
            <label htmlFor="favorite-candidate-search">Pesquisar favoritos</label>
            <div className={styles.searchWrapper}>
              <BiSearch className={styles.searchIcon} size={20} aria-hidden="true" />
              <input
                id="favorite-candidate-search"
                type="search"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Buscar por nome..."
              />
              {searchTerm && (
                <button type="button" onClick={() => setSearchTerm('')}>
                  Limpar
                </button>
              )}
            </div>
          </form>
        </div>

        {errorMsg && (
          <div className={styles.messageBox} role="alert">
            {errorMsg}
          </div>
        )}

        {loading ? (
          <div className={styles.stateBox}>
            <p>Carregando favoritos...</p>
          </div>
        ) : candidatos.length > 0 ? (
          candidatosFiltrados.length > 0 ? (
            <div className={styles.candidatesGrid}>
              {candidatosFiltrados.map((candidato) => (
                <CandidateCard
                  key={candidato.id}
                  candidato={candidato}
                  onToggleFavorito={handleToggleFavorito}
                  favoriteLoading={favoriteLoadingId === candidato.id}
                />
              ))}
            </div>
          ) : (
            <div className={styles.stateBox}>
              <p>Nenhum favorito encontrado para "{searchTerm.trim()}".</p>
            </div>
          )
        ) : (
          <div className={styles.emptyState}>
            <div className={styles.emptyIconWrapper}>
              <BiHeart size={48} />
            </div>
            <h2>Nenhum candidato favorito ainda</h2>
            <p>
              Use o coração nos cards da busca para montar uma shortlist de perfis
              interessantes para sua empresa.
            </p>
            <Link to="/empresa/candidatos/buscar" className={styles.emptyAction}>
              Buscar candidatos
            </Link>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
