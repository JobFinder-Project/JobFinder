import styles from './Modal.module.css'

function Modal({ 
  title, 
  hideHeader = false,
  hideCloseButton = false,
  onClose, 
  children, 
  size = 'md',
  className = '' 
}) {
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose?.()
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      onClose?.()
    }
  }

  return (
    <div 
      className={styles.modalOverlay} 
      onClick={handleOverlayClick}
      onKeyDown={handleKeyDown}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
    >
      <div 
        className={`${styles.modalContent} ${styles[size]} ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        {!hideHeader && (
          <div className={styles.modalHeader}>
            {title && <h2 id="modal-title">{title}</h2>}
            {!hideCloseButton && (
              <button 
                className={styles.closeButton} 
                onClick={onClose}
                aria-label="Fechar modal"
              >
                &times;
              </button>
            )}
          </div>
        )}
        <div className={styles.modalBody}>
          {children}
        </div>
      </div>
    </div>
  )
}

// Subcomponentes para composição avançada
Modal.Header = function ModalHeader({ children, className = '' }) {
  return (
    <div className={`${styles.customHeader} ${className}`}>
      {children}
    </div>
  )
}

Modal.Body = function ModalBody({ children, className = '' }) {
  return (
    <div className={`${styles.customBody} ${className}`}>
      {children}
    </div>
  )
}

Modal.Footer = function ModalFooter({ children, className = '' }) {
  return (
    <div className={`${styles.modalFooter} ${className}`}>
      {children}
    </div>
  )
}

export default Modal
