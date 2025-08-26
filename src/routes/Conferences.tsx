import React from 'react'
import { Link } from 'react-router-dom'

// Replace with Firestore later if desired
const sample = [
  { id:'necypaa-2026', name:'NECYPAA 2026', dates:'Apr 3–5, 2026', city:'Portland, ME' },
  { id:'masscypaa-2026', name:'MASSCYPAA 2026', dates:'Sep 18–20, 2026', city:'Boston, MA' }
]

export default function Conferences(){
  return (
    <div className="container">
      <h2>Conferences</h2>
      <div className="row">
        {sample.map(c => (
          <Link key={c.id} to={`/app/conference/${c.id}`} className="card" style={{flex:'1 1 320px'}}>
            <div className="badge">Conference</div>
            <h3>{c.name}</h3>
            <div className="small">{c.dates} • {c.city}</div>
          </Link>
        ))}
      </div>
    </div>
  )
}
