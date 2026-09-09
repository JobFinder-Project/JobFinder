import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { BiSearch, BiFilterAlt } from 'react-icons/bi'
import DashboardLayout from '../../components/Layout/DashboardLayout/DashboardLayout'
import CandidateCard from '../../features/candidato/CandidateCard'
import { empresaService } from '../../services/empresaService'
import styles from './BuscaCandidatos.module.css'

const MIN_SEARCH_LENGTH = 2

export default function BuscaCandidatos() {
    const [searchParams, setSearchParams] = useSearchParams()

    const query = searchParams.get('q') || ''
    const vagaId = searchParams.get('vagaId') // Pegamos a vaga da URL

    const [searchTerm, setSearchTerm] = useState(query)
    const [candidatos, setCandidatos] = useState([])
    const [loading, setLoading] = useState(false)
    const [searchError, setSearchError] = useState('')

    useEffect(() => {
        const termo = query.trim()

        if (!vagaId && termo.length < MIN_SEARCH_LENGTH) {
            setCandidatos([])
            setSearchError('')
            setLoading(false)
            return
        }

        if (termo && termo.length < MIN_SEARCH_LENGTH) {
            setCandidatos([])
            setSearchError('Informe ao menos 2 caracteres para pesquisar.')
            setLoading(false)
            return
        }

        fetchCandidatos(query, vagaId)
    }, [query, vagaId])

    const fetchCandidatos = async (termoDeBusca, idDaVaga) => {
        setLoading(true)
        setSearchError('')
        try {
            const data = await empresaService.buscarCandidatos(termoDeBusca, idDaVaga)
            setCandidatos(data.candidatos || data || [])
        } catch (error) {
            console.error('Erro ao buscar candidatos:', error)
            setCandidatos([])
            setSearchError(error.message || 'Não foi possível realizar a busca.')
        } finally {
            setLoading(false)
        }
    }

    const handleSearchSubmit = (e) => {
        e.preventDefault()
        const termo = searchTerm.trim()

        if (termo && termo.length < MIN_SEARCH_LENGTH) {
            setSearchError('Informe ao menos 2 caracteres para pesquisar.')
            return
        }

        if (!vagaId && termo.length < MIN_SEARCH_LENGTH) {
            setCandidatos([])
            setSearchError('Informe ao menos 2 caracteres para pesquisar.')
            return
        }

        const params = {}
        if (termo) params.q = termo
        if (vagaId) params.vagaId = vagaId
        setSearchParams(params)
    }

    const hasSearchCriteria = Boolean(vagaId || query.trim().length >= MIN_SEARCH_LENGTH)

    return (
        <DashboardLayout userType="employer">
            <div className={styles.container}>
                <div className={styles.pageHeader}>
                    <div>
                        <h1 className={styles.pageTitle}>{vagaId ? 'Candidatos da Vaga' : 'Banco de Talentos global'}</h1>
                        <p className={styles.pageSubtitle}>{vagaId ? 'Visualizando pessoas que se aplicaram ou têm o perfil para esta vaga.' : 'Descubra profissionais incríveis para sua empresa'}</p>
                    </div>
                </div>

                {/* Barra de Pesquisa e Filtros */}
                <div className={styles.searchSection}>
                    <form onSubmit={handleSearchSubmit} className={styles.searchForm}>
                        <div className={styles.searchWrapper}>
                            <BiSearch className={styles.searchIcon} size={20} />
                            <input
                                type="text"
                                placeholder="Buscar por nome, cargo ou habilidades..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className={styles.searchInput}
                                aria-describedby="candidate-search-help"
                            />
                            <button type="submit" className={styles.searchBtn}>
                                Buscar
                            </button>
                        </div>

                        <button type="button" className={styles.filterBtn}>
                            <BiFilterAlt size={20} />
                            <span>Filtros</span>
                        </button>
                    </form>
                    <p id="candidate-search-help" className={styles.emptyText}>
                        Use ao menos 2 caracteres. Dados de contato aparecem somente na gestão de candidaturas.
                    </p>
                </div>

                {/* Contagem de Resultados */}
                <div className={styles.resultsInfo}>
                    {!loading && (
                        <p>
                            Mostrando <span className={styles.boldText}>{candidatos.length}</span> candidatos
                            {query && <span> para "{query}"</span>}
                        </p>
                    )}
                </div>

                {/* Grid de Candidatos */}
                <div className={styles.candidatesGrid}>
                    {loading ? (
                        <div className={styles.loadingState}>
                            <div className={styles.spinner}></div>
                            <p>Carregando talentos...</p>
                        </div>
                    ) : candidatos.length > 0 ? (
                        candidatos.map((candidato, index) => <CandidateCard key={`${candidato.nome}-${index}`} candidato={candidato} />)
                    ) : (
                        <div className={styles.emptyState}>
                            <div className={styles.emptyIconWrapper}>
                                <BiSearch size={48} />
                            </div>
                            <h3 className={styles.emptyTitle}>
                                {searchError ? 'Não foi possível pesquisar' : hasSearchCriteria ? 'Nenhum candidato encontrado' : 'Pesquise por um perfil profissional'}
                            </h3>
                            <p className={styles.emptyText}>
                                {searchError ||
                                    (hasSearchCriteria ? 'Não encontramos resultados para sua busca. Tente outro termo.' : 'Informe nome, qualificação, formação ou habilidade para iniciar a busca.')}
                            </p>
                            {query && (
                                <button
                                    onClick={() => {
                                        setSearchTerm('')
                                        setSearchParams({})
                                    }}
                                    className={styles.clearBtn}
                                >
                                    Limpar Busca
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    )
}
