import styles from './ShinkaiBackground.module.css'

export default function ShinkaiBackground({ children }) {
  return (
    <div className={styles.root}>
      {/* depth layers */}
      <div className={`${styles.layer} ${styles.canopy}`} />
      <div className={`${styles.layer} ${styles.haze}`} />

      {/* light beams */}
      <div className={`${styles.layer} ${styles.beams}`}>
        <div className={styles.beam} />
        <div className={styles.beam} />
        <div className={styles.beam} />
        <div className={styles.beam} />
        <div className={styles.beam} />
      </div>

      {/* mist */}
      <div className={styles.mist} />
      <div className={styles.mist} />
      <div className={styles.mist} />
      <div className={styles.mist} />
      <div className={styles.mist} />

      {/* bokeh */}
      <div className={styles.bokeh} />
      <div className={styles.bokeh} />
      <div className={styles.bokeh} />
      <div className={styles.bokeh} />
      <div className={styles.bokeh} />
      <div className={styles.bokeh} />
      <div className={styles.bokeh} />
      <div className={styles.bokeh} />

      {/* mid-ground silhouette */}
      <div className={`${styles.layer} ${styles.midground}`} />

      {/* vignette */}
      <div className={`${styles.layer} ${styles.vignette}`} />

      {/* app content */}
      <div className={styles.children}>{children}</div>
    </div>
  )
}
