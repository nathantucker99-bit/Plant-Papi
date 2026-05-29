import styles from './Spinner.module.css'

export default function Spinner({ size }) {
  return (
    <div className={`${styles.wrap} ${size === 'sm' ? styles.sm : ''}`}>
      <div className={styles.ring} />
    </div>
  )
}
