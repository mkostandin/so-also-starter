import React from 'react'

export default function MapView(){
  return (
    <div className="container">
      <h2>Map</h2>
      <div className="card center" style={{height:360}}>🗺️ Map goes here (wire Mapbox/Leaflet)</div>
      <p className="small">Only upcoming items are shown (endUTC ≥ now).</p>
    </div>
  )
}
