import React from 'react'
import { useTopicState } from '../lib/topics'

export default function TopicToggle({ topic }: { topic: { id: string; label: string } }){
  const { subscribed, toggle } = useTopicState(topic.id)
  return (
    <div className="card" style={{flex:'1 1 280px'}}>
      <strong>{topic.label}</strong>
      <div style={{marginTop:8}}>
        <button className="btn" onClick={toggle}>
          {subscribed ? 'Disable' : 'Enable'}
        </button>
      </div>
      <div className="small" style={{marginTop:6}}>Topic: {topic.id}</div>
    </div>
  )
}
