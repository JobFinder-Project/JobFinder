import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BiLogOut } from 'react-icons/bi'
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
<BiLogOut size={25} />
          </button>
        </li>
      </ul>
    </nav>
  )
}

export default NavbarEmpresa
