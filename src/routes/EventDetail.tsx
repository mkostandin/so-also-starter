import React from 'react'
import { useParams } from 'react-router-dom'
import { shareLink } from '../lib/sharing'
import { FlagButton } from '../components/FlagButton'

export default function EventDetail(){
  const { slug } = useParams()
  const url = `https://your-domain/app/e/${slug}`
  const name = `Sample Event — ${slug}`

  return (
    <div className="container">
      <div className="card">
        <div className="badge">Event</div>
        <h2 style={{marginTop:6}}>{name}</h2>
        <div className="small">Sat, Oct 18 • Manchester, NH</div>
        <p style={{marginTop:12}}>Event description goes here. Flyer is optional.</p>
        <div className="row">
          <a className="btn secondary" href="https://maps.google.com?q=Manchester%2C%20NH" target="_blank" rel="noreferrer">Directions</a>
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
