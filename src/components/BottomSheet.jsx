import { useEffect } from 'react'
import styles from './BottomSheet.module.css'

export default function BottomSheet({ onClose, children }) {
  // close on back-swipe / escape
  useEffect(() => {
    function onKey(e) { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.sheet} onClick={e => e.stopPropagation()}>
        <div className={styles.handle}>
          <div className={styles.handleBar} />
        </div>
        <div className={styles.body}>{children}</div>
      </div>
    </div>
  )
}
