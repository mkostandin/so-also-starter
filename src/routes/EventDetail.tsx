import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { shareLink } from '../lib/sharing'
import { FlagButton } from '../components/FlagButton'

export default function EventDetail(){
  const { slug } = useParams()
  const url = `https://soalso.org/app/e/${slug}`
  const name = `Sample Event — ${slug}`
  const navigate = useNavigate()

  // Debug logging
  console.log('EventDetail rendered with slug:', slug)
  console.log('Current location:', window.location.href)

  // If no slug, show error
  if (!slug) {
    return (
      <div className="container">
        <div className="card">
          <h2>Error: No event slug provided</h2>
          <p>The event slug is missing from the URL.</p>
          <button
            className="btn"
            onClick={() => navigate('/app/map')}
          >
            Back to Map
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="container">
      <div className="card">
        <div className="row" style={{justifyContent:'space-between', alignItems:'center'}}>
          <button
            className="btn secondary"
            onClick={() => {
              if (window.history.length > 1) navigate(-1)
              else navigate('/app/map')
            }}
            aria-label="Back"
          >
            ← Back
          </button>
          <div className="badge">Event</div>
        </div>
        <h2 style={{marginTop:6}}>{name}</h2>
        <div className="small">Sat, Oct 18 • Manchester, NH</div>
        <p style={{marginTop:12}}>Event description goes here. Flyer is optional.</p>
        <p style={{marginTop:12, fontSize: '12px', color: '#666'}}>Debug: slug = {slug}</p>
        <div className="row">
          <a className="btn secondary" href="https://maps.google.com?q=Manchester%2C%20NH" target="_blank" rel="noreferrer noopener">Directions</a>
          <button className="btn" onClick={() => shareLink({ title: 'So Also Event', text:'Join us!', url })}>Share</button>
          <FlagButton
            compact
            targetType="event"
            targetId={slug || 'unknown'}
            targetPath={`events/${slug}`}
            targetName={name}
            committeeSlug={null}
          />
        </div>
      </div>
    </div>
  )
}
