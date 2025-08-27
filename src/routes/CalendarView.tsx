import React, { useMemo } from 'react'

type Item = {
  id: string
  name: string
  type: string
  startUTC: string
  endUTC: string
  city?: string
}

// Placeholder demo data; replace with Firestore merged query
const demo: Item[] = [
  { id:'a', name:'YPAA Fall Kickoff', type:'Event', startUTC:'2025-10-18T22:00:00Z', endUTC:'2025-10-19T02:00:00Z', city:'Manchester, NH' },
  { id:'b', name:'Monthly Committee', type:'Committee Meeting', startUTC:'2025-09-12T23:00:00Z', endUTC:'2025-09-13T00:00:00Z', city:'Concord, NH' },
  { id:'c', name:'Area Roundup', type:'Event', startUTC:'2025-09-13T18:00:00Z', endUTC:'2025-09-13T21:00:00Z', city:'Nashua, NH' },
]

function toLocalDateKey(iso: string){
  const d = new Date(iso)
  const y = d.getFullYear()
  const m = String(d.getMonth()+1).padStart(2,'0')
  const day = String(d.getDate()).padStart(2,'0')
  return `${y}-${m}-${day}`
}

function formatDayHeader(key: string){
  const [y,m,d] = key.split('-').map(Number)
  const date = new Date(y, (m-1), d)
  return date.toLocaleDateString(undefined, { weekday:'long', month:'short', day:'numeric' })
}

function formatTimeRange(startIso: string, endIso: string){
  const s = new Date(startIso)
  const e = new Date(endIso)
  const f = new Intl.DateTimeFormat(undefined, { hour:'numeric', minute:'2-digit' })
  return `${f.format(s)} – ${f.format(e)}`
}

export default function CalendarView(){
  const groups = useMemo(() => {
    const upcoming = demo
      .filter(it => new Date(it.endUTC).getTime() >= Date.now())
      .sort((a,b) => new Date(a.startUTC).getTime() - new Date(b.startUTC).getTime())
    const map = new Map<string, Item[]>()
    for (const it of upcoming){
      const key = toLocalDateKey(it.startUTC)
      const arr = map.get(key) || []
      arr.push(it)
      map.set(key, arr)
    }
    return Array.from(map.entries()).sort(([a],[b]) => a.localeCompare(b))
  }, [])

  return (
    <div>
      {groups.map(([dayKey, items]) => (
        <div key={dayKey} style={{marginBottom:12}}>
          <div className="small" style={{opacity:.9, margin:'8px 4px'}}>{formatDayHeader(dayKey)}</div>
          <div className="row">
            {items.map(it => (
              <a key={it.id} className="card" style={{flex:'1 1 320px'}} href={`/app/e/${it.id}`}>
                <div className="badge">{it.type}</div>
                <h3>{it.name}</h3>
                <div className="small">{formatTimeRange(it.startUTC, it.endUTC)}{it.city ? ` • ${it.city}` : ''}</div>
              </a>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}


