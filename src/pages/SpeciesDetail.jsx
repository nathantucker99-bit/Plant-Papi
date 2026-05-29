import { useNavigate } from 'react-router-dom'
import Button from '../components/Button'
import styles from './SpeciesDetail.module.css'

function confLevel(score) {
  if (score >= 0.7) return 'high'
  if (score >= 0.35) return 'medium'
  return 'low'
}

export default function SpeciesDetail({ result, onClose }) {
  const navigate = useNavigate()
  const pct = Math.round(result.score * 100)
  const level = confLevel(result.score)

  function handleAdd() {
    sessionStorage.setItem('identifiedPlant', JSON.stringify(result))
    onClose()
    navigate('/plant/new')
  }

  return (
    <>
      {result.imageUrl
        ? <img src={result.imageUrl} className={styles.hero} alt={result.scientificName} />
        : <div className={styles.heroPlaceholder}>🌿</div>
      }

      <p className={styles.sciName}>{result.scientificName}</p>
      {result.commonNames[0] && (
        <p className={styles.commonName}>{result.commonNames[0]}</p>
      )}

      {/* confidence */}
      <div className={styles.confRow}>
        <div className={styles.confTrack}>
          <div
            className={`${styles.confFill} ${styles[level]}`}
            style={{ width: `${pct}%` }}
          />
        </div>
        <span className={`${styles.confPct} ${styles[level]}`}>{pct}%</span>
      </div>

      {/* common names */}
      {result.commonNames.length > 0 && (
        <div className={styles.section}>
          <p className={styles.sectionTitle}>Common names</p>
          {result.commonNames.map(n => (
            <span key={n} className={styles.pill}>{n}</span>
          ))}
        </div>
      )}

      {/* taxonomy */}
      <div className={styles.section}>
        <p className={styles.sectionTitle}>Taxonomy</p>
        {result.family && (
          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>Family</span>
            <span className={styles.infoValue}>{result.family}</span>
          </div>
        )}
        <div className={styles.infoRow}>
          <span className={styles.infoLabel}>Scientific name</span>
          <span className={styles.infoValue} style={{ fontStyle: 'italic' }}>{result.scientificName}</span>
        </div>
      </div>

      {/* GBIF link */}
      {result.gbifId && (
        <a
          className={styles.gbifLink}
          href={`https://www.gbif.org/species/${result.gbifId}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          View on GBIF ↗
        </a>
      )}

      <div className={styles.addBtn}>
        <Button variant="primary" full onClick={handleAdd}>
          Add to My Plants
        </Button>
      </div>
    </>
  )
}
