import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { authService } from '../../../services'
import styles from './NavbarEmpresa.module.css'

function NavbarEmpresa({ 
  showSearch = true, 
  searchPlaceholder = 'Buscar Candidatos 🔍',
  initialSearchValue = '',
  onSearch
}) {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState(initialSearchValue)

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      if (onSearch) {
        onSearch(searchQuery)
      } else {
        navigate(`/empresa/candidatos/buscar?q=${encodeURIComponent(searchQuery)}`)
      }
    }
  }

  const handleLogout = async () => {
    try {
      await authService.logout()
      navigate('/login')
    } catch (error) {
      console.error('Erro ao fazer logout:', error)
      navigate('/login')
    }
  }

  return (
    <nav className={styles.navbar}>
      <h1 className={styles.logo}>JobFinder</h1>
      
      {showSearch && (
        <div className={styles.searchContainer}>
          <form onSubmit={handleSearch}>
            <input
              type="text"
              name="q"
              className={styles.searchInput}
              placeholder={searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" className={styles.searchButton}>
              Buscar
            </button>
          </form>
        </div>
      )}
      
      <ul className={styles.navbarMenu}>
        <li>
          <button onClick={handleLogout} className={styles.logoutButton} title="Sair">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="25"
              height="25"
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
          </button>
        </li>
      </ul>
    </nav>
  )
}

export default NavbarEmpresa
