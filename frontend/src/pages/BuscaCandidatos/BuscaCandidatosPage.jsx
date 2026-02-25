import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { BiSearch, BiFilterAlt } from 'react-icons/bi'
import DashboardLayout from '../../components/Layout/DashboardLayout/DashboardLayout'
import CandidateCard from '../../features/candidato/CandidateCard'
import { empresaService } from '../../services/empresaService'
import styles from './BuscaCandidatos.module.css'

export default function BuscaCandidatos() {
    const [searchParams, setSearchParams] = useSearchParams()
    const navigate = useNavigate()

    const query = searchParams.get('q') || ''
    const vagaId = searchParams.get('vagaId') // Pegamos a vaga da URL

    const [searchTerm, setSearchTerm] = useState(query)
    const [candidatos, setCandidatos] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchCandidatos(query, vagaId)
    }, [query, vagaId])

    // Passamos o vagaId para o service (mesmo que o backend ignore por enquanto)
    const fetchCandidatos = async (termoDeBusca, idDaVaga) => {
        setLoading(true)
        try {
            const data = await empresaService.buscarCandidatos(termoDeBusca, idDaVaga)
            setCandidatos(data.candidatos || data || [])
        } catch (error) {
            console.error('Erro ao buscar candidatos:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        const params = {};
        if (searchTerm) params.q = searchTerm;
        if (vagaId) params.vagaId = vagaId; // Mantém o filtro da vaga se houver
        setSearchParams(params);
    };

    return (
        <DashboardLayout userType="employer">
            <div className={styles.container}>

                <div className={styles.pageHeader}>
                    <div>
                        <h1 className={styles.pageTitle}>
                            {vagaId ? 'Candidatos da Vaga' : 'Banco de Talentos global'}
                        </h1>
                        <p className={styles.pageSubtitle}>
                            {vagaId
                                ? 'Visualizando pessoas que se aplicaram ou têm o perfil para esta vaga.'
                                : 'Descubra profissionais incríveis para sua empresa'}
                        </p>
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
                        candidatos.map((candidato) => (
                            <CandidateCard key={candidato._id} candidato={candidato} />
                        ))
                    ) : (
                        <div className={styles.emptyState}>
                            <div className={styles.emptyIconWrapper}>
                                <BiSearch size={48} />
                            </div>
                            <h3 className={styles.emptyTitle}>Nenhum candidato encontrado</h3>
                            <p className={styles.emptyText}>
                                Não encontramos resultados para sua busca. Tente usar termos mais genéricos.
                            </p>
                            {query && (
                                <button
                                    onClick={() => {
                                        setSearchTerm('');
                                        setSearchParams({});
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