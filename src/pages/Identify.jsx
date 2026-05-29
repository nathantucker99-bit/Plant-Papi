import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { identifyPlant } from '../utils/plantnet'
import Spinner from '../components/Spinner'
import Card from '../components/Card'
import Button from '../components/Button'
import styles from './Identify.module.css'

export default function Identify() {
  const navigate = useNavigate()
  const image = sessionStorage.getItem('capturedImage')

  const [results, setResults] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!image) { navigate('/camera', { replace: true }); return }

    identifyPlant(image)
      .then(setResults)
      .catch(err => setError(err.message === 'no_match' ? 'no_match' : 'api_error'))
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  function handleRetry() {
    sessionStorage.removeItem('capturedImage')
    navigate('/camera')
  }

  function handleAddPlant(result) {
    // pass chosen identification to the save-plant flow (Task 8)
    sessionStorage.setItem('identifiedPlant', JSON.stringify(result))
    navigate('/plant/new')
  }

  return (
    <div className={styles.page}>
      {/* header */}
      <div className={styles.header}>
        <button className={styles.backBtn} onClick={() => navigate(-1)}>←</button>
        <span className={styles.heading}>
          {results ? 'Results' : error ? 'No Match' : 'Identifying…'}
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
            {error === 'no_match'
              ? "We couldn't identify this plant. Try a clearer photo of the leaves or flowers."
              : 'Something went wrong. Check your connection and try again.'}
          </p>
          <Button variant="primary" onClick={handleRetry}>Try Again</Button>
        </div>
      )}

      {/* results */}
      {results && (
        <div className={styles.results}>
          <p className={styles.sectionLabel}>Best matches</p>

          {results.map((r, i) => (
            <Card key={r.scientificName} pressable={i === 0} className={i === 0 ? styles.top : ''}>
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
                  {r.family && (
                    <p className={styles.family}>{r.family}</p>
                  )}
                  <div className={styles.confBar}>
                    <div
                      className={styles.confFill}
                      style={{ width: `${Math.round(r.score * 100)}%` }}
                    />
                  </div>
                  <p className={styles.confLabel}>{Math.round(r.score * 100)}% confidence</p>
                </div>
              </div>

              {i === 0 && (
                <div className={styles.addRow}>
                  <Button variant="primary" full onClick={() => handleAddPlant(r)}>
                    Add to My Plants
                  </Button>
                </div>
              )}
            </Card>
          ))}

          <Button variant="ghost" full onClick={handleRetry}>
            Try a different photo
          </Button>
        </div>
      )}
    </div>
  )
}
