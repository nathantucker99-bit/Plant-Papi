import styles from './Badge.module.css'

export default function Badge({ status, label }) {
  return (
    <span className={`${styles.badge} ${styles[status]}`}>
      {label}
    </span>
  )
}
