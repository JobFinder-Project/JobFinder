import { useRef, useState, useEffect } from 'react'
import { BiChevronLeft, BiChevronRight } from 'react-icons/bi'
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
        <BiChevronLeft size={18} />
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
        <BiChevronRight size={18} />
      </button>
    </div>
  )
}

export default CategoryFilter
