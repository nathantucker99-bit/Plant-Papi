import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { identifyPlant } from '../utils/plantnet'
import Spinner from '../components/Spinner'
import Card from '../components/Card'
import Button from '../components/Button'
import BottomSheet from '../components/BottomSheet'
import SpeciesDetail from './SpeciesDetail'
import styles from './Identify.module.css'

function confLevel(score) {
  if (score >= 0.7) return 'high'
  if (score >= 0.35) return 'medium'
  return 'low'
}

export default function Identify() {
  const navigate = useNavigate()
  const image = sessionStorage.getItem('capturedImage')

  const [results, setResults] = useState(null)
  const [error, setError] = useState(null)
  const [selected, setSelected] = useState(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!image) { navigate('/camera', { replace: true }); return }
    identifyPlant(image)
      .then(data => { setResults(data); setTimeout(() => setVisible(true), 50) })
      .catch(err => {
        console.error('PlantNet error:', err.message)
        const m = err.message
        if (m === 'no_match') setError('no_match')
        else if (m === 'no_key') setError('no_key')
        else if (m === 'bad_key') setError('bad_key')
        else setError(m || 'api_error')
      })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  function handleRetry() {
    sessionStorage.removeItem('capturedImage')
    navigate('/camera')
  }

  return (
    <div className={styles.page}>
      {/* header */}
      <div className={styles.header}>
        <button className={styles.backBtn} onClick={() => navigate(-1)}>←</button>
        <span className={styles.heading}>
          {results ? 'Results' : error === 'no_match' ? 'No Match' : error ? 'Error' : 'Identifying…'}
        </span>
      </div>

      {/* captured thumbnail */}
      {image && (
        <div className={styles.thumb}>
          <img src={image} alt="Captured plant" />
          <div className={styles.thumbOverlay} />
        </div>
      )}

      {/* loading */}
      {!results && !error && (
        <div className={styles.loadingWrap}>
          <Spinner />
          <p className={styles.loadingText}>Scanning plant database…</p>
        </div>
      )}

      {/* error */}
      {error && (
        <div className={styles.errorWrap}>
          <div className={styles.errorIcon}>{error === 'no_match' ? '🔍' : '⚠️'}</div>
          <p className={styles.errorMsg}>
            {error === 'no_match' && "We couldn't identify this plant. Try a clearer photo of the leaves or flowers."}
            {error === 'no_key' && "API key not configured. Add VITE_PLANTNET_API_KEY to GitHub Secrets and redeploy."}
            {error === 'bad_key' && "API key is invalid. Check the key in GitHub Secrets."}
            {error !== 'no_match' && error !== 'no_key' && error !== 'bad_key' && (
              <span style={{ fontFamily: 'monospace', fontSize: 12, wordBreak: 'break-all' }}>{error}</span>
            )}
          </p>
          <Button variant="primary" onClick={handleRetry}>Try Again</Button>
        </div>
      )}

      {/* results */}
      {results && (
        <div className={styles.results}>
          <p className={styles.sectionLabel}>Best matches</p>

          {results.map((r, i) => {
            const pct = Math.round(r.score * 100)
            const level = confLevel(r.score)
            return (
              <div
                key={r.scientificName}
                className={`${styles.cardWrap} ${visible ? styles.entered : ''}`}
                style={{ transitionDelay: `${i * 70}ms` }}
              >
                <Card pressable onClick={() => setSelected(r)} className={i === 0 ? styles.topCard : ''}>
                  <div className={styles.resultCard}>
                    {r.imageUrl
                      ? <img src={r.imageUrl} className={styles.resultThumb} alt={r.scientificName} />
                      : <div className={styles.resultThumbPlaceholder}>🌿</div>
                    }
                    <div className={styles.resultInfo}>
                      <p className={styles.scientificName}>{r.scientificName}</p>
                      {r.commonNames[0] && (
                        <p className={styles.commonName}>{r.commonNames[0]}</p>
                      )}
                      {r.family && <p className={styles.family}>{r.family}</p>}
                      <div className={styles.confBar}>
                        <div
                          className={`${styles.confFill} ${styles[level]}`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <p className={`${styles.confLabel} ${styles[level]}`}>{pct}% match</p>
                    </div>
                  </div>

                  {i === 0 && (
                    <div className={styles.addRow}>
                      <Button variant="primary" full onClick={e => { e.stopPropagation(); setSelected(r) }}>
                        View &amp; Add →
                      </Button>
                    </div>
                  )}
                </Card>
              </div>
            )
          })}

          <Button variant="ghost" full onClick={handleRetry}>
            Try a different photo
          </Button>
        </div>
      )}

      {/* species detail sheet */}
      {selected && (
        <BottomSheet onClose={() => setSelected(null)}>
          <SpeciesDetail result={selected} onClose={() => setSelected(null)} />
        </BottomSheet>
      )}
    </div>
  )
}
