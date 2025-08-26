import React from 'react'

export default function EmbedView(){
  const sp = new URLSearchParams(location.search)
  const committee = sp.get('committee') || 'all'
  const view = sp.get('view') || 'map'
  const range = sp.get('range') || '60d'
  return (
    <div className="container">
      <div className="card">
        <div className="small">Embed mode</div>
        <h3>Committee: {committee}</h3>
        <p className="small">View: {view} • Range: {range}</p>
        <div className="card center" style={{height:280}}>This iframe shows only filtered events.</div>
        <a className="btn" href={`/app/map?committee=${committee}`}>Open in So Also</a>
      </div>
    </div>
  )
}
