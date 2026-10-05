import { useEffect, useId, useRef } from 'react'
import styles from './Modal.module.css'

export default function Modal({
    title,
    hideHeader = false,
    hideCloseButton = false,
    onClose,
    children,
    size = 'md',
    className = ''
}) {
    const dialogRef = useRef(null)
    const onCloseRef = useRef(onClose)
    onCloseRef.current = onClose
    const titleId = useId()
    useEffect(() => {
        const previousFocus = document.activeElement
        const dialog = dialogRef.current
        const focusable = 'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        const firstElement = dialog?.querySelector(focusable)
        if (firstElement) firstElement.focus()
        else dialog?.focus()
        const handleDocumentKeyDown = (event) => {
            if (document.querySelectorAll('[role="dialog"]:not([hidden])').item(document.querySelectorAll('[role="dialog"]:not([hidden])').length - 1) !== dialog) return
            if (event.key === 'Escape') {
                event.preventDefault()
                onCloseRef.current?.()
            }
            if (event.key !== 'Tab') return
            const elements = [...dialog.querySelectorAll(focusable)]
            if (!elements.length) { event.preventDefault(); dialog.focus(); return }
            if (event.shiftKey && (document.activeElement === elements[0] || !dialog.contains(document.activeElement))) {
                event.preventDefault()
                elements[elements.length - 1].focus()
            } else if (!event.shiftKey && (document.activeElement === elements[elements.length - 1] || !dialog.contains(document.activeElement))) {
                event.preventDefault()
                elements[0].focus()
            }
        }
        document.addEventListener('keydown', handleDocumentKeyDown)
        return () => {
            document.removeEventListener('keydown', handleDocumentKeyDown)
            if (previousFocus instanceof HTMLElement && previousFocus.isConnected) previousFocus.focus()
        }
    }, [])

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose?.()
        }
    }

    return (
        <div
            ref={dialogRef}
            tabIndex={-1}
            className={styles.modalOverlay}
            onClick={handleOverlayClick}
            role='dialog'
            aria-modal='true'
            aria-labelledby={title ? titleId : undefined}
        >
            <div
                className={`${styles.modalContent} ${styles[size]} ${className}`}
                onClick={(e) => e.stopPropagation()}
            >
                {!hideHeader && (
                    <div className={styles.modalHeader}>
                        {title && <h2 id={titleId}>{title}</h2>}
                        {!hideCloseButton && (
                            <button
                                className={styles.closeButton}
                                onClick={onClose}
                                aria-label='Fechar modal'
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
