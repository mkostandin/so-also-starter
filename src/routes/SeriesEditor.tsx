import React, { useMemo, useState } from 'react'
import { generateInstancesForMonths } from '../lib/instanceGen'

type Freq = 'weekly'|'monthly'
type Weekday = 'SU'|'MO'|'TU'|'WE'|'TH'|'FR'|'SA'

export default function SeriesEditor(){
  const [name, setName] = useState('Area 43 Committee Meeting')
  const [type, setType] = useState<'Committee Meeting'|'YPAA Meeting'>('Committee Meeting')
  const [timezone, setTimezone] = useState('America/New_York')
  const [startTime, setStartTime] = useState('19:00')
  const [duration, setDuration] = useState(60)
  const [freq, setFreq] = useState<Freq>('monthly')
  const [byWeekday, setByWeekday] = useState<Weekday[]>(['SU'])
  const [bySetPos, setBySetPos] = useState<number[]>([2]) // e.g., 2nd Sunday
  const [interval, setInterval] = useState(1)
  const [monthsAhead, setMonthsAhead] = useState(6)
  const [startMonth, setStartMonth] = useState(() => new Date().toISOString().slice(0,7)) // YYYY-MM

  const preview = useMemo(() => {
    try {
      return generateInstancesForMonths({
        name, type,
        timezone, startTimeLocal: startTime, durationMins: duration,
        rRule: { freq, interval, byWeekday, bySetPos, byMonth:[], until:null, count:null },
        startMonth, monthsAhead
      }).slice(0,12)
    } catch(e:any){
      return [{ error: e?.message || 'Invalid settings'}] as any
    }
  }, [name,type,timezone,startTime,duration,freq,byWeekday,bySetPos,interval,startMonth,monthsAhead])

  function toggleWeekday(w:Weekday){
    setByWeekday(prev => prev.includes(w) ? prev.filter(x=>x!==w) : [...prev, w] as Weekday[])
  }
  function togglePos(p:number){
    setBySetPos(prev => prev.includes(p) ? prev.filter(x=>x!==p) : [...prev, p])
  }

  return (
    <div className="container">
      <h2>Recurring meeting (Series)</h2>
      <div className="card">
        <div className="grid2">
          <label>Name<input className="input" value={name} onChange={e=>setName(e.target.value)}/></label>
          <label>Type
            <select className="input" value={type} onChange={e=>setType(e.target.value as any)}>
              <option>Committee Meeting</option>
              <option>YPAA Meeting</option>
            </select>
          </label>
        </div>
        <div className="grid2">
          <label>Timezone<input className="input" value={timezone} onChange={e=>setTimezone(e.target.value)}/></label>
          <label>Start time (local)<input className="input" value={startTime} onChange={e=>setStartTime(e.target.value)} placeholder="19:00"/></label>
        </div>
        <div className="grid2">
          <label>Duration (mins)<input className="input" type="number" value={duration} onChange={e=>setDuration(parseInt(e.target.value)||60)}/></label>
          <label>Every (interval)
            <input className="input" type="number" min={1} value={interval} onChange={e=>setInterval(parseInt(e.target.value)||1)}/>
          </label>
        </div>

        <label>Frequency
          <select className="input" value={freq} onChange={e=>setFreq(e.target.value as Freq)}>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly (nth weekday)</option>
          </select>
        </label>

        {freq==='weekly' && (
          <div className="card" style={{marginTop:10}}>
            <strong>Weekdays</strong>
            <div className="row">
              {(['SU','MO','TU','WE','TH','FR','SA'] as Weekday[]).map(w => (
                <button key={w} className={'btn ' + (byWeekday.includes(w)? '':'secondary')} onClick={()=>toggleWeekday(w)}>{w}</button>
              ))}
            </div>
          </div>
        )}

        {freq==='monthly' && (
          <>
            <div className="card" style={{marginTop:10}}>
              <strong>Weekday</strong>
              <div className="row">
                {(['SU','MO','TU','WE','TH','FR','SA'] as Weekday[]).map(w => (
                  <button key={w} className={'btn ' + (byWeekday.includes(w)? '':'secondary')} onClick={()=>setByWeekday([w])}>{w}</button>
                ))}
              </div>
            </div>
            <div className="card" style={{marginTop:10}}>
              <strong>Positions</strong>
              <div className="row">
                {[1,2,3,4].map(p => (
                  <button key={p} className={'btn ' + (bySetPos.includes(p)? '':'secondary')} onClick={()=>togglePos(p)}>{['1st','2nd','3rd','4th'][p-1]}</button>
                ))}
              </div>
            </div>
          </>
        )}

        <div className="grid2" style={{marginTop:10}}>
          <label>Start month (YYYY-MM)
            <input className="input" value={startMonth} onChange={e=>setStartMonth(e.target.value)} placeholder="2026-01"/>
          </label>
          <label>Generate months ahead
            <input className="input" type="number" min={1} max={12} value={monthsAhead} onChange={e=>setMonthsAhead(parseInt(e.target.value)||6)}/>
          </label>
        </div>

        <div className="row" style={{marginTop:12}}>
          <button className="btn">Save series</button>
          <button className="btn secondary">Generate preview only</button>
        </div>
      </div>

      <div className="card" style={{marginTop:12}}>
        <h3>Next dates (preview)</h3>
        <ol>
          {Array.isArray(preview) && preview.map((p:any, i:number) => (
            'error' in p
              ? <li key={i} style={{color:'#f88'}}>{p.error}</li>
              : <li key={i}>{p.startsAtLocal} → {p.endsAtLocal}</li>
          ))}
        </ol>
      </div>

      {/* TODO:
        - On Save: write /series doc with these fields.
        - Then call instance generator to write to /occurrences (or /series/{id}/instances).
      */}
    </div>
  )
}
