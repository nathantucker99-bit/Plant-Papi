import { BrowserRouter, Routes, Route } from 'react-router-dom'
import AppShell from './components/AppShell'
import Button from './components/Button'
import Card from './components/Card'
import Badge from './components/Badge'
import Spinner from './components/Spinner'

function Home() {
  return (
    <div style={{ padding: 'var(--space-5)', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
      <h1 style={{ fontSize: '22px', color: 'var(--text-primary)' }}>PlantPal</h1>

      <Card>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-3)' }}>Monstera deliciosa</p>
        <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
          <Badge status="ok" label="Watered" />
          <Badge status="due" label="Due today" />
          <Badge status="overdue" label="Overdue" />
        </div>
      </Card>

      <Button variant="primary" full>Identify a plant</Button>
      <Button variant="secondary" full>My plants</Button>
      <Button variant="ghost">Cancel</Button>

      <Spinner />
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AppShell>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </AppShell>
    </BrowserRouter>
  )
}

export default App
