import React from 'react'
import { TopicToggle } from '../lib/topics'

const regularTopics = [
  { id:'events-all', label:'All regular events' },
  { id:'events-nhscypaa', label:'NHSCYPAA events' } // example
]

export default function Settings(){
  return (
    <div className="container">
      <h2>Settings</h2>
      <div className="card">
        <p><strong>Notifications</strong></p>
        <p className="small">Enable pushes and pick the topics you care about.</p>
        <div className="row">
          {regularTopics.map(t => <TopicToggle key={t.id} topic={t} />)}
        </div>
        <hr style={{opacity:.1, margin:'12px 0'}}/>
        <p><strong>Account</strong></p>
        <button className="btn">Sign in</button>
      </div>
    </div>
  )
}
