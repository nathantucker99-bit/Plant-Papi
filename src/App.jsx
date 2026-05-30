import { HashRouter as BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import AppShell from './components/AppShell'
import Button from './components/Button'
import Card from './components/Card'
import Camera from './pages/Camera'
import Identify from './pages/Identify'
import NewPlant from './pages/NewPlant'
import { getPlants } from './utils/storage'

function Home() {
  const navigate = useNavigate()
  const [plants, setPlants] = useState([])

  useEffect(() => {
    setPlants(getPlants())
  }, [])

  return (
    <div style={{
      padding: 'var(--space-5)',
      paddingTop: 'calc(env(safe-area-inset-top) + var(--space-5))',
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-4)',
    }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
        <h1 style={{ fontSize: '26px', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.5px' }}>
          PlantPal
        </h1>
        {plants.length > 0 && (
          <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
            {plants.length} plant{plants.length !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      <Button variant="primary" full onClick={() => navigate('/camera')}>
        📷 Identify a Plant
      </Button>

      {plants.length === 0 && (
        <p style={{ color: 'var(--text-muted)', fontSize: '14px', textAlign: 'center', paddingTop: 'var(--space-5)' }}>
          No plants yet. Take a photo to get started.
        </p>
      )}

      {plants.map(p => (
        <Card key={p.id} pressable>
          <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center' }}>
            {p.thumbnailUrl
              ? <img src={p.thumbnailUrl} alt={p.name} style={{ width: 52, height: 52, borderRadius: 8, objectFit: 'cover', flexShrink: 0 }} />
              : <div style={{ width: 52, height: 52, borderRadius: 8, background: 'var(--bg-surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>🌿</div>
            }
            <div style={{ minWidth: 0 }}>
              <p style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: 15, marginBottom: 2 }}>{p.name}</p>
              {p.scientificName && (
                <p style={{ fontSize: 12, color: 'var(--text-muted)', fontStyle: 'italic', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {p.scientificName}
                </p>
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/camera" element={<Camera />} />
        <Route path="/identify" element={<AppShell><Identify /></AppShell>} />
        <Route path="/plant/new" element={<AppShell><NewPlant /></AppShell>} />
        <Route path="/*" element={
          <AppShell>
            <Routes>
              <Route path="/" element={<Home />} />
            </Routes>
          </AppShell>
        } />
      </Routes>
    </BrowserRouter>
  )
}

export default App
