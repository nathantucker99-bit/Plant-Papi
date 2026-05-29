const PLANTS_KEY = 'plantpal:plants'

export function getPlants() {
  try {
    return JSON.parse(localStorage.getItem(PLANTS_KEY) || '[]')
  } catch {
    return []
  }
}

export function getPlant(id) {
  return getPlants().find(p => p.id === id) ?? null
}

export function savePlant(plant) {
  const plants = getPlants()
  const idx = plants.findIndex(p => p.id === plant.id)
  if (idx >= 0) {
    plants[idx] = plant
  } else {
    plants.unshift(plant)
  }
  localStorage.setItem(PLANTS_KEY, JSON.stringify(plants))
  return plant
}

export function deletePlant(id) {
  const plants = getPlants().filter(p => p.id !== id)
  localStorage.setItem(PLANTS_KEY, JSON.stringify(plants))
}

export function createPlant(fields) {
  const plant = {
    id: crypto.randomUUID(),
    addedAt: new Date().toISOString(),
    notes: '',
    thumbnailUrl: null,
    scientificName: '',
    commonName: '',
    family: '',
    ...fields,
  }
  return savePlant(plant)
}
