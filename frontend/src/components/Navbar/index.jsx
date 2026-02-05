import { useState } from 'react'
import { Link } from 'react-router-dom'
import styles from './Navbar.module.css'

function Navbar({ inDashboard = false, onOpenCandidaturas, onOpenPerfil }) {
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      window.location.href = `/candidato/vagas/buscar?q=${encodeURIComponent(searchQuery)}`
    }
  }

  return (
    <nav className={styles.navbar}>
      <div className={styles.navbarLeft}>
        <h1>JobFinder</h1>
      </div>

      <div className={styles.navbarCenter}>
        <form onSubmit={handleSearch} className={styles.searchForm}>
          <input
            type="text"
            name="q"
            className={styles.searchInput}
            placeholder="Buscar Vagas"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit" className={styles.searchButton}>
            Buscar
          </button>
        </form>
      </div>

      <ul className={styles.navbarMenu}>
        {inDashboard ? (
          <>
            <li>
              <button
                className={styles.navbarButton}
                onClick={onOpenCandidaturas}
                title="Minhas Candidaturas"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  fill="currentColor"
                  viewBox="0 0 16 16"
                >
                  <path d="M14.5 3a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-13a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5zm-13-1A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2z" />
                  <path d="M7 5.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5m-1.496-.854a.5.5 0 0 1 0 .708l-1.5 1.5a.5.5 0 0 1-.708 0l-.5-.5a.5.5 0 1 1 .708-.708l.146.147 1.146-1.147a.5.5 0 0 1 .708 0M7 9.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5m-1.496-.854a.5.5 0 0 1 0 .708l-1.5 1.5a.5.5 0 0 1-.708 0l-.5-.5a.5.5 0 0 1 .708-.708l.146.147 1.146-1.147a.5.5 0 0 1 .708 0" />
                </svg>
                <span className={styles.navbarLabel}>Candidaturas</span>
              </button>
            </li>
            <li>
              <button
                className={styles.navbarButton}
                onClick={onOpenPerfil}
                title="Perfil"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  fill="currentColor"
                  viewBox="0 0 16 16"
                >
                  <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
                  <path
                    fillRule="evenodd"
                    d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"
                  />
                </svg>
                <span className={styles.navbarLabel}>Perfil</span>
              </button>
            </li>
          </>
        ) : (
          <li>
            <Link
              to="/candidato/dashboard"
              className={styles.navbarButton}
              title="Voltar"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="currentColor"
                viewBox="0 0 16 16"
              >
                <path
                  fillRule="evenodd"
                  d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14zm0 1A8 8 0 1 1 8 0a8 8 0 0 1 0 16z"
                />
                <path
                  fillRule="evenodd"
                  d="M8.354 11.354a.5.5 0 0 1-.708 0l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L6.707 8l2.647 2.646a.5.5 0 0 1 0 .708z"
                />
                <path
                  fillRule="evenodd"
                  d="M11.5 8a.5.5 0 0 1-.5.5h-6a.5.5 0 0 1 0-1h6a.5.5 0 0 1 .5.5z"
                />
              </svg>
              <span className={styles.navbarLabel}>Voltar</span>
            </Link>
          </li>
        )}
        <li>
          <Link to="/logout" className={styles.navbarButton} title="Sair">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              fill="currentColor"
              viewBox="0 0 16 16"
            >
              <path
                fillRule="evenodd"
                d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0z"
              />
              <path
                fillRule="evenodd"
                d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708z"
              />
            </svg>
            <span className={styles.navbarLabel}>Sair</span>
          </Link>
        </li>
      </ul>
    </nav>
  )
}

export default Navbar
