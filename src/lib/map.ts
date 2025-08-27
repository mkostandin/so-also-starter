export type MapEventItem = {
  id: string
  slug?: string
  name: string
  type: string
  startUTC: string
  endUTC: string
  lat: number
  lng: number
  city?: string
}

export type Feature = {
  type: 'Feature'
  geometry: { type: 'Point'; coordinates: [number, number] }
  properties: Record<string, unknown>
}

export type FeatureCollection = { type: 'FeatureCollection'; features: Feature[] }

export function toFeatureCollection(items: MapEventItem[]): FeatureCollection {
  return {
    type: 'FeatureCollection',
    features: items
      .filter(it => isFinite(it.lat) && isFinite(it.lng))
      .map(it => ({
        type: 'Feature',
        geometry: { type: 'Point', coordinates: [it.lng, it.lat] },
        properties: {
          id: it.slug || it.id,
          name: it.name,
          type: it.type,
          startUTC: it.startUTC,
          endUTC: it.endUTC,
          city: it.city
        }
      }))
  }
}

export function computeBounds(fc: FeatureCollection){
  let minLng = Infinity, minLat = Infinity, maxLng = -Infinity, maxLat = -Infinity
  for (const f of fc.features){
    const [lng, lat] = f.geometry.coordinates
    if (lng < minLng) minLng = lng
    if (lat < minLat) minLat = lat
    if (lng > maxLng) maxLng = lng
    if (lat > maxLat) maxLat = lat
  }
  if (!isFinite(minLng) || !isFinite(minLat) || !isFinite(maxLng) || !isFinite(maxLat)) return null
  return [[minLng, minLat], [maxLng, maxLat]] as [[number, number], [number, number]]
}


