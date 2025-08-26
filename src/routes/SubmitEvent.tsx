import React, { useState } from 'react'
import { Link } from 'react-router-dom'

export default function SubmitEvent(){
  const [sent, setSent] = useState(false)

  function onSubmit(e: React.FormEvent){
    e.preventDefault()
    // TODO: validate + send to Firestore (status:'pending'; flyer optional)
    setSent(true)
  }

  if (sent) {
    return (
      <div className="container card">
        <h3>Thanks! 🎉</h3>
        <p>Your event is pending moderator review. We emailed you a link to edit details.</p>
        <p className="small">Recurring meetings? Use the <Link to="/app/series/new">Series editor</Link>.</p>
      </div>
    )
  }

  return (
    <div className="container">
      <h2>Submit event</h2>
      <form className="card" onSubmit={onSubmit}>
        <label>Event name<input className="input" required placeholder="So Also Kickoff"/></label>
        <label>Type
          <select required className="input">
            <option>Event</option>
            <option>Committee Meeting</option>
            <option>Conference</option>
            <option>YPAA Meeting</option>
            <option>Other</option>
          </select>
        </label>
        <label>Committee (optional)<input className="input" placeholder="NHSCYPAA"/></label>
        <div className="grid2">
          <label>Start<input className="input" type="datetime-local" required/></label>
          <label>End<input className="input" type="datetime-local" required/></label>
        </div>
        <label>Address<input className="input" placeholder="123 Main St, City, State"/></label>
        <label>Event website (https)<input className="input" type="url" placeholder="https://..."/></label>
        <label>Description<textarea className="input" rows={4} placeholder="What’s happening?" required/></label>
        <div className="grid2">
          <label>Contact email (private)<input className="input" type="email" placeholder="you@example.org"/></label>
          <label>Contact phone (private)<input className="input" placeholder="+1 555-123-4567"/></label>
        </div>
        <label>Flyer (optional)<input className="input" type="file" accept="image/*"/></label>
        <button className="btn" type="submit">Submit for review</button>
      </form>
    </div>
  )
}
