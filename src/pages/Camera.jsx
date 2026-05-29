import { useRef, useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './Camera.module.css'

export default function Camera() {
  const navigate = useNavigate()
  const videoRef = useRef(null)
  const streamRef = useRef(null)
  const canvasRef = useRef(null)

  const [ready, setReady] = useState(false)
  const [error, setError] = useState(null)
  const [captured, setCaptured] = useState(null) // data URL
  const [flash, setFlash] = useState(false)

  // start rear camera
  useEffect(() => {
    let active = true

    async function startCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: 'environment' }, width: { ideal: 1920 }, height: { ideal: 1080 } },
          audio: false,
        })
        if (!active) { stream.getTracks().forEach(t => t.stop()); return }
        streamRef.current = stream
        if (videoRef.current) {
          videoRef.current.srcObject = stream
          videoRef.current.onloadedmetadata = () => {
            videoRef.current.play()
            setReady(true)
          }
        }
      } catch (err) {
        if (active) setError(err.name === 'NotAllowedError' ? 'permission' : 'unavailable')
      }
    }

    startCamera()
    return () => {
      active = false
      streamRef.current?.getTracks().forEach(t => t.stop())
    }
  }, [])

  const capture = useCallback(() => {
    if (!videoRef.current || !ready) return
    const video = videoRef.current
    const canvas = canvasRef.current
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    canvas.getContext('2d').drawImage(video, 0, 0)
    const dataUrl = canvas.toDataURL('image/jpeg', 0.92)
    setFlash(true)
    setTimeout(() => setFlash(false), 300)
    streamRef.current?.getTracks().forEach(t => t.stop())
    setCaptured(dataUrl)
  }, [ready])

  function retake() {
    setCaptured(null)
    setReady(false)
    // restart stream
    navigator.mediaDevices.getUserMedia({
      video: { facingMode: { ideal: 'environment' } },
      audio: false,
    }).then(stream => {
      streamRef.current = stream
      videoRef.current.srcObject = stream
      videoRef.current.onloadedmetadata = () => { videoRef.current.play(); setReady(true) }
    }).catch(() => setError('unavailable'))
  }

  function handleGallery(e) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => {
      streamRef.current?.getTracks().forEach(t => t.stop())
      setCaptured(ev.target.result)
    }
    reader.readAsDataURL(file)
  }

  function handleIdentify() {
    sessionStorage.setItem('capturedImage', captured)
    navigate('/identify')
  }

  return (
    <div className={styles.page}>
      <canvas ref={canvasRef} style={{ display: 'none' }} />

      {/* top bar */}
      <div className={styles.topBar}>
        <button className={styles.backBtn} onClick={() => navigate(-1)}>←</button>
        <span className={styles.title}>{captured ? 'Review' : 'Identify Plant'}</span>
        <div className={styles.topSpacer} />
      </div>

      {/* viewfinder or preview */}
      <div className={styles.viewfinder}>
        {!captured && error === null && (
          <>
            <video
              ref={videoRef}
              className={styles.video}
              playsInline
              muted
              autoPlay
            />
            <div className={styles.guide}>
              <div className={`${styles.corner} ${styles.tl}`} />
              <div className={`${styles.corner} ${styles.tr}`} />
              <div className={`${styles.corner} ${styles.bl}`} />
              <div className={`${styles.corner} ${styles.br}`} />
            </div>
          </>
        )}

        {captured && (
          <img src={captured} className={styles.preview} alt="Captured plant" />
        )}

        {error && (
          <div className={styles.errorState}>
            <div className={styles.errorIcon}>🌿</div>
            <p className={styles.errorText}>
              {error === 'permission'
                ? 'Camera access was denied.\nPlease allow camera in Settings and reload.'
                : 'Camera is not available on this device.'}
            </p>
          </div>
        )}

        {flash && <div className={styles.flash} />}
      </div>

      {/* bottom bar */}
      <div className={styles.bottomBar}>
        {!captured ? (
          <>
            {/* gallery picker */}
            <label className={styles.galleryBtn}>
              🖼
              <input
                type="file"
                accept="image/*"
                className={styles.galleryInput}
                onChange={handleGallery}
              />
            </label>

            {/* capture */}
            <button
              className={styles.captureBtn}
              onClick={capture}
              disabled={!ready}
              aria-label="Capture photo"
            />

            <div style={{ width: 52 }} />
          </>
        ) : (
          <>
            {/* retake */}
            <button className={styles.retakeBtn} onClick={retake} aria-label="Retake">↩</button>

            {/* identify */}
            <button className={styles.identifyBtn} onClick={handleIdentify}>
              Identify →
            </button>

            <div style={{ width: 52 }} />
          </>
        )}
      </div>
    </div>
  )
}
