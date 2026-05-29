import styles from './AppShell.module.css'
import ShinkaiBackground from './ShinkaiBackground'

export default function AppShell({ children }) {
  return (
    <div className={styles.shell}>
      <ShinkaiBackground>
        <div className={styles.content}>
          {children}
        </div>
      </ShinkaiBackground>
    </div>
  )
}
