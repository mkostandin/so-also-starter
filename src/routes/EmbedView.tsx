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
        <div className="card center" style={{height:280}}>
          {view === 'list' && 'This iframe shows a list of filtered events.'}
          {view === 'map' && 'This iframe shows a map of filtered events.'}
          {view === 'calendar' && 'This iframe shows a calendar of filtered events.'}
        </div>
        <a className="btn" href={`/app/map${view === 'list' ? '/list' : view === 'calendar' ? '/calendar' : ''}?committee=${committee}`}>Open in So Also</a>
      </div>
    </div>
  )
}
