import { useRef, useState, useEffect } from 'react'
import styles from './CategoryFilter.module.css'

function CategoryFilter({ areas, selectedCategory, onCategoryClick }) {
  const listRef = useRef(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  const updateScrollButtons = () => {
    if (listRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = listRef.current
      setCanScrollLeft(scrollLeft > 0)
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10)
    }
  }

  useEffect(() => {
    updateScrollButtons()
    window.addEventListener('resize', updateScrollButtons)
    return () => window.removeEventListener('resize', updateScrollButtons)
  }, [areas])

  const scrollLeft = () => {
    if (listRef.current) {
      listRef.current.scrollBy({ left: -200, behavior: 'smooth' })
      setTimeout(updateScrollButtons, 300)
    }
  }

  const scrollRight = () => {
    if (listRef.current) {
      listRef.current.scrollBy({ left: 200, behavior: 'smooth' })
      setTimeout(updateScrollButtons, 300)
    }
  }

  return (
    <div className={styles.categories}>
      <button
        className={`${styles.categoryArrow} ${styles.left} ${!canScrollLeft ? styles.disabled : ''}`}
        onClick={scrollLeft}
        disabled={!canScrollLeft}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
          <path d="M11 1.5a.5.5 0 0 1 .5.5v12a.5.5 0 0 1-1 0v-12a.5.5 0 0 1 .5-.5z" />
          <path d="M4.854 8.354a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 8l2.855 2.854a.5.5 0 1 1-.708.708l-3-3z" />
        </svg>
      </button>

      <div
        ref={listRef}
        className={styles.categoriesList}
        onScroll={updateScrollButtons}
      >
        {areas.map((area) => (
          <button
            key={area}
            className={`${styles.categoryChip} ${selectedCategory === area ? styles.active : ''}`}
            onClick={() => onCategoryClick(area)}
          >
            {area}
          </button>
        ))}
      </div>

      <button
        className={`${styles.categoryArrow} ${styles.right} ${!canScrollRight ? styles.disabled : ''}`}
        onClick={scrollRight}
        disabled={!canScrollRight}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
          <path d="M5 1.5a.5.5 0 0 0-.5.5v12a.5.5 0 0 0 1 0v-12a.5.5 0 0 0-.5-.5z" />
          <path d="M11.146 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 8l-2.855 2.854a.5.5 0 1 0 .708.708l3-3z" />
        </svg>
      </button>
    </div>
  )
}

export default CategoryFilter
