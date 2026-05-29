import styles from './Card.module.css'

export default function Card({ children, padded = true, pressable, onClick, className }) {
  const cls = [
    styles.card,
    padded && styles.padded,
    pressable && styles.pressable,
    className,
  ].filter(Boolean).join(' ')

  return (
    <div className={cls} onClick={onClick} role={onClick ? 'button' : undefined}>
      {children}
    </div>
  )
}
