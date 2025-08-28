import React, { useEffect, useMemo, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import mapboxgl from 'mapbox-gl'
import { computeBounds, toFeatureCollection, type MapEventItem } from '../lib/map'

export default function MapHome(){
  const containerRef = useRef<HTMLDivElement | null>(null)
  const mapRef = useRef<mapboxgl.Map | null>(null)
  const navigate = useNavigate()

  // TODO: Replace with Firestore fetch. Demo items for now.
  const items: MapEventItem[] = useMemo(() => ([
    { id:'fall-kickoff', name:'YPAA Fall Kickoff', type:'Event', startUTC:'2025-10-18T22:00:00Z', endUTC:'2025-10-19T02:00:00Z', lat:42.9956, lng:-71.4548, city:'Manchester, NH' },
    { id:'committee-meet', name:'Monthly Committee', type:'Committee Meeting', startUTC:'2025-09-12T23:00:00Z', endUTC:'2025-09-13T00:00:00Z', lat:43.2081, lng:-71.5376, city:'Concord, NH' },
    { id:'area-roundup', name:'Area Roundup', type:'Event', startUTC:'2025-09-13T18:00:00Z', endUTC:'2025-09-13T21:00:00Z', lat:42.7654, lng:-71.4676, city:'Nashua, NH' }
  ]), [])

  useEffect(() => {
    if (!containerRef.current) return
    if (mapRef.current) return

    // Add event listener for navigation
    const handleNavigateToEvent = (event: CustomEvent<string>) => {
      navigate(`/app/e/${event.detail}`)
    }

    window.addEventListener('navigateToEvent', handleNavigateToEvent as EventListener)

    mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN
    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: [-71.5, 43.0],
      zoom: 7,
      attributionControl: false
    })
    mapRef.current = map

    map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), 'top-right')
    map.addControl(new mapboxgl.GeolocateControl({ trackUserLocation: false }), 'top-right')

    map.on('load', () => {
      const fc = toFeatureCollection(items)
      map.addSource('events', {
        type: 'geojson',
        data: fc as any,
        cluster: true,
        clusterRadius: 50,
        clusterMaxZoom: 14
      })

      map.addLayer({
        id: 'clusters',
        type: 'circle',
        source: 'events',
        filter: ['has', 'point_count'],
        paint: {
          'circle-color': '#0ea5e9',
          'circle-opacity': 0.28,
          'circle-stroke-color': '#0ea5e9',
          'circle-stroke-width': 1,
          'circle-radius': [
            'step',
            ['get', 'point_count'],
            16, 10, 20, 50, 26, 100, 32
          ]
        }
      })

      map.addLayer({
        id: 'cluster-count',
        type: 'symbol',
        source: 'events',
        filter: ['has', 'point_count'],
        layout: {
          'text-field': ['get', 'point_count_abbreviated'],
          'text-size': 12
        },
        paint: {
          'text-color': '#0284c7'
        }
      })

      map.addLayer({
        id: 'unclustered-point',
        type: 'circle',
        source: 'events',
        filter: ['!', ['has', 'point_count']],
        paint: {
          'circle-color': '#22d3ee',
          'circle-radius': 5,
          'circle-stroke-width': 1,
          'circle-stroke-color': '#0ea5e9'
        }
      })

      map.on('click', 'clusters', (e) => {
        const features = map.queryRenderedFeatures(e.point, { layers: ['clusters'] })
        const clusterId = features[0]?.properties?.cluster_id as number | undefined
        const source = map.getSource('events') as mapboxgl.GeoJSONSource
        if (!clusterId || !source) return
        source.getClusterExpansionZoom(clusterId, (err, zoom) => {
          if (err || zoom === null) return
          const coordinates = (features[0].geometry as any).coordinates as [number, number]
          map.easeTo({ center: coordinates, zoom })
        })
      })
      // Formatting for the popup
      map.on('click', 'unclustered-point', (e) => {
        const f = e.features?.[0] as any
        if (!f) return
        const coordinates = (f.geometry.coordinates as [number, number]).slice() as [number, number]
        const name = f.properties?.name as string
        const id = f.properties?.id as string
        const city = f.properties?.city as string | undefined
        const html = `<div style="min-width:180px"><strong style="color:#333;font-weight:600;">${name}</strong>${city ? `<div style="font-size:12px;color:#666;margin-top:4px;">${city}</div>`: ''}<div style=\"margin-top:8px\"><button class=\"btn\" onclick=\"window.dispatchEvent(new CustomEvent('navigateToEvent', { detail: '${id}' }))\">Open</button></div></div>`
        new mapboxgl.Popup({ offset: 12 }).setLngLat(coordinates).setHTML(html).addTo(map)
      })

      const bounds = computeBounds(fc)
      if (bounds) map.fitBounds(bounds as any, { padding: 40, duration: 600 })
    })

    return () => {
      map.remove()
      window.removeEventListener('navigateToEvent', handleNavigateToEvent as EventListener)
    }
  }, [items])

  return (
    <div>
      <div className="card map-card">
        <div className="map-wrapper">
          <div ref={containerRef} className="map-container" />
        </div>
      </div>
      <p className="small">Only upcoming items are shown (endUTC ≥ now).</p>
    </div>
  )
}


