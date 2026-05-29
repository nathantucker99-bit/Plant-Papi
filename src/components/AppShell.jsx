import styles from './AppShell.module.css'

export default function AppShell({ children }) {
  return (
    <div className={styles.shell}>
      <div className={styles.content}>
        {children}
      </div>
    </div>
  )
}
