import React from 'react'

// Replace this with Firestore query later (see FIRESTORE snippet below).
const fake = [
  { id:'fall-kickoff', name:'YPAA Fall Kickoff', type:'Event', starts:'2025-10-18 6:00 PM', ends:'10:00 PM', city:'Manchester, NH' },
  { id:'committee-meet', name:'Monthly Committee', type:'Committee Meeting', starts:'2025-09-12 7:00 PM', ends:'8:00 PM', city:'Concord, NH' }
]

export default function ListView(){
  return (
    <div className="container">
      <h2>List</h2>
      <div className="row">
        {fake.map(ev => (
          <a key={ev.id} className="card" style={{flex:'1 1 320px'}} href={`/app/e/${ev.id}`}>
            <div className="badge">{ev.type}</div>
            <h3>{ev.name}</h3>
            <div className="small">{ev.starts} • {ev.city}</div>
          </a>
        ))}
      </div>

      {/* FIRESTORE: combined query (one-offs + occurrences)
      import { collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore'
      import { db } from '../lib/firebase'
      const nowIso = new Date().toISOString()
      // one-offs
      const q1 = query(
        collection(db,'events'),
        where('status','==','approved'),
        where('endUTC','>=', nowIso),
        orderBy('endUTC','asc'),
        limit(200)
      )
      // recurring instances
      const q2 = query(
        collection(db,'occurrences'),
        where('status','==','approved'),
        where('endUTC','>=', nowIso),
        orderBy('endUTC','asc'),
        limit(200)
      )
      */}
    </div>
  )
}
