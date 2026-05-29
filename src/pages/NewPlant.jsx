import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createPlant } from '../utils/storage'
import Button from '../components/Button'
import styles from './NewPlant.module.css'

export default function NewPlant() {
  const navigate = useNavigate()

  const identified = (() => {
    try { return JSON.parse(sessionStorage.getItem('identifiedPlant') || 'null') } catch { return null }
  })()

  const capturedImage = sessionStorage.getItem('capturedImage')

  const [name, setName] = useState(identified?.commonNames?.[0] ?? '')
  const [notes, setNotes] = useState('')

  function handleSave() {
    if (!name.trim()) return

    createPlant({
      name: name.trim(),
      scientificName: identified?.scientificName ?? '',
      commonName: identified?.commonNames?.[0] ?? '',
      family: identified?.family ?? '',
      thumbnailUrl: identified?.imageUrl ?? null,
      capturedImageKey: capturedImage ? 'capturedImage' : null,
      notes: notes.trim(),
    })

    sessionStorage.removeItem('identifiedPlant')
    sessionStorage.removeItem('capturedImage')
    navigate('/', { replace: true })
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <button className={styles.backBtn} onClick={() => navigate(-1)}>←</button>
        <span className={styles.heading}>Add Plant</span>
      </div>

      {/* hero image */}
      <div className={styles.hero}>
        {capturedImage
          ? <img src={capturedImage} className={styles.heroImg} alt="Captured plant" />
          : identified?.imageUrl
            ? <img src={identified.imageUrl} className={styles.heroImg} alt={identified.scientificName} />
            : <div className={styles.heroPlaceholder}>🌿</div>
        }
        {(identified?.scientificName || identified?.family) && (
          <>
            <div className={styles.heroOverlay} />
            <div className={styles.heroLabel}>
              {identified.scientificName && <p className={styles.sciName}>{identified.scientificName}</p>}
              {identified.family && <p className={styles.familyName}>{identified.family}</p>}
            </div>
          </>
        )}
      </div>

      {/* form */}
      <div className={styles.form}>
        <div className={styles.fieldGroup}>
          <label className={styles.label} htmlFor="plantName">Nickname</label>
          <input
            id="plantName"
            className={styles.input}
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="e.g. Living room monstera"
            autoFocus
          />
        </div>

        <div className={styles.fieldGroup}>
          <label className={styles.label} htmlFor="plantNotes">Notes (optional)</label>
          <textarea
            id="plantNotes"
            className={styles.textarea}
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder="Where it lives, special care needs…"
          />
        </div>

        <div className={styles.saveBtn}>
          <Button variant="primary" full onClick={handleSave} disabled={!name.trim()}>
            Save Plant
          </Button>
        </div>
      </div>
    </div>
  )
}
