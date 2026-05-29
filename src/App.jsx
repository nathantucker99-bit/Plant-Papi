import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom'
import AppShell from './components/AppShell'
import Button from './components/Button'
import Camera from './pages/Camera'
import Identify from './pages/Identify'

function Home() {
  const navigate = useNavigate()
  return (
    <div style={{ padding: 'var(--space-5)', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', paddingTop: 'calc(env(safe-area-inset-top) + var(--space-5))' }}>
      <h1 style={{ fontSize: '26px', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.5px' }}>PlantPal</h1>
      <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>Identify and care for your plants.</p>
      <Button variant="primary" full onClick={() => navigate('/camera')}>
        📷 Identify a Plant
      </Button>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/camera" element={<Camera />} />
        <Route path="/identify" element={
          <AppShell>
            <Identify />
          </AppShell>
        } />
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
