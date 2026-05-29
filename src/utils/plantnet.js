const BASE = 'https://my-api.plantnet.org/v2/identify/all'

function dataUrlToBlob(dataUrl) {
  const [header, data] = dataUrl.split(',')
  const mime = header.match(/:(.*?);/)[1]
  const bytes = atob(data)
  const buf = new Uint8Array(bytes.length)
  for (let i = 0; i < bytes.length; i++) buf[i] = bytes.charCodeAt(i)
  return new Blob([buf], { type: mime })
}

export async function identifyPlant(imageDataUrl) {
  const apiKey = import.meta.env.VITE_PLANTNET_API_KEY
  if (!apiKey) throw new Error('VITE_PLANTNET_API_KEY is not set')

  const blob = dataUrlToBlob(imageDataUrl)
  const form = new FormData()
  form.append('images', blob, 'plant.jpg')
  form.append('organs', 'auto')

  const res = await fetch(`${BASE}?api-key=${apiKey}&lang=en&nb-results=5`, {
    method: 'POST',
    body: form,
  })

  if (res.status === 404) throw new Error('no_match')
  if (!res.ok) {
    const msg = await res.text().catch(() => res.statusText)
    throw new Error(msg)
  }

  const json = await res.json()

  return (json.results || []).map(r => ({
    scientificName: r.species?.scientificNameWithoutAuthor ?? 'Unknown',
    commonNames: r.species?.commonNames ?? [],
    family: r.species?.family?.scientificNameWithoutAuthor ?? '',
    score: r.score ?? 0,
    gbifId: r.gbif?.id ?? null,
    imageUrl: r.images?.[0]?.url?.m ?? null,
  }))
}
