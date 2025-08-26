import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import TopicToggle from '../components/TopicToggle'
import { FlagButton } from '../components/FlagButton'

type Session = {
  id: string; title: string; type: 'workshop'|'panel'|'main'|'marathon';
  starts: string; ends: string; room?: string; desc?: string;
}

const fakeConf = {
  id: 'necypaa-2026',
  name: 'NECYPAA 2026',
  city: 'Portland, ME',
  dates: 'Apr 3–5, 2026',
  flyerUrl: '',
  programUrl: 'https://example.com/necypaa-program.pdf',
  hotelMapUrl: 'https://example.com/hotel-map.jpg'
}

const fakeSessions: Session[] = [
  { id:'s1', title:'Workshop: Sponsorship', type:'workshop', starts:'Apr 3, 2:00 PM', ends:'3:00 PM', room:'Salon A' },
  { id:'s2', title:'Panel: Newcomers Q&A', type:'panel', starts:'Apr 3, 4:00 PM', ends:'5:00 PM', room:'Salon C' },
  { id:'s3', title:'Main Meeting: Friday Night', type:'main', starts:'Apr 4, 8:00 PM', ends:'9:30 PM', room:'Ballroom' },
  { id:'s4', title:'Marathon Meetings (overnight)', type:'marathon', starts:'Apr 4, 10:00 PM', ends:'Apr 5, 6:00 AM', room:'Marathon Room' },
]

type Tab = 'program'|'workshops'|'panels'|'main'|'marathon'|'hotel'|'notify'

export default function ConferenceDetail(){
  const { id } = useParams()
  const conf = fakeConf // TODO: fetch /conferences/{id}
  const [tab, setTab] = useState<Tab>('program')

  const workshops = fakeSessions.filter(s => s.type==='workshop')
  const panels    = fakeSessions.filter(s => s.type==='panel')
  const main      = fakeSessions.filter(s => s.type==='main')
  const marathon  = fakeSessions.filter(s => s.type==='marathon')

  return (
    <div className="container">
      <div className="card">
        <div className="badge">Conference</div>
        <h2 style={{marginTop:6}}>{conf.name}</h2>
        <div className="small">{conf.dates} • {conf.city}</div>
        {conf.flyerUrl ? (
          <img src={conf.flyerUrl} alt="Conference flyer" style={{width:'100%',borderRadius:12,marginTop:10}}/>
        ) : null}
        <div className="row" style={{marginTop:8}}>
          <FlagButton
            compact
            targetType="conference"
            targetId={conf.id}
            targetPath={`conferences/${conf.id}`}
            targetName={conf.name}
            committeeSlug={null}
          />
        </div>
      </div>

      <Tabs tab={tab} setTab={setTab}/>

      {tab==='program' && (
        <section className="card">
          <h3>Program</h3>
          <p className="small">Full agenda as a PDF or Canva.</p>
          <a className="btn" href={conf.programUrl} target="_blank" rel="noreferrer">Open Program</a>
        </section>
      )}

      {tab==='workshops' && <SessionList title="Workshops" items={workshops}/>}
      {tab==='panels'    && <SessionList title="Panels" items={panels}/>}
      {tab==='main'      && <SessionList title="Main Meetings" items={main}/>}
      {tab==='marathon'  && <SessionList title="Marathon Meetings" items={marathon}/>}

      {tab==='hotel' && (
        <section className="card">
          <h3>Hotel Map</h3>
          {conf.hotelMapUrl?.endsWith('.pdf') ? (
            <a className="btn" href={conf.hotelMapUrl} target="_blank" rel="noreferrer">Open Hotel Map (PDF)</a>
          ) : (
            <img src={conf.hotelMapUrl} alt="Hotel map" style={{width:'100%',borderRadius:12}}/>
          )}
        </section>
      )}

      {tab==='notify' && <NotifyPanel confId={conf.id}/>}
    </div>
  )
}

function Tabs({tab,setTab}:{tab:Tab; setTab:(t:Tab)=>void}){
  const items: {k:Tab; label:string}[] = [
    {k:'program', label:'Program'},
    {k:'workshops', label:'Workshops'},
    {k:'panels', label:'Panels'},
    {k:'main', label:'Main'},
    {k:'marathon', label:'Marathon'},
    {k:'hotel', label:'Hotel Map'},
    {k:'notify', label:'Notifications'},
  ]
  return (
    <nav className="card" style={{display:'flex',gap:8,flexWrap:'wrap'}}>
      {items.map(i=>(
        <button key={i.k}
          className={'btn ' + (i.k===tab ? '' : 'secondary')}
          onClick={()=>setTab(i.k)}>
          {i.label}
        </button>
      ))}
    </nav>
  )
}

function SessionList({title, items}:{title:string; items:Session[]}){
  return (
    <section className="row">
      <h3 style={{width:'100%'}}>{title}</h3>
      {items.length===0 && <p className="small" style={{paddingLeft:12}}>No sessions posted yet.</p>}
      {items.map(s => (
        <div key={s.id} className="card" style={{flex:'1 1 320px'}}>
          <div className="badge">{s.type}</div>
          <h4 style={{marginTop:6}}>{s.title}</h4>
          <div className="small">{s.starts} – {s.ends}{s.room ? ` • ${s.room}`:''}</div>
          {s.desc ? <p style={{marginTop:8}}>{s.desc}</p> : null}
          {/* Optional per-session flag:
          <div style={{marginTop:8}}>
            <FlagButton compact targetType="session" targetId={s.id} targetPath={`conferences/${conf.id}/sessions/${s.id}`} targetName={s.title}/>
          </div> */}
        </div>
      ))}
    </section>
  )
}

function NotifyPanel({confId}:{confId:string}){
  const topics = [
    { id:`conf-${confId}-all`, label:'All conference notifications' },
    { id:`conf-${confId}-workshops`, label:'Workshops' },
    { id:`conf-${confId}-panels`, label:'Panels' },
    { id:`conf-${confId}-main`, label:'Main meetings' },
    { id:`conf-${confId}-marathon`, label:'Marathon meetings' },
  ]
  return (
    <section className="card">
      <h3>Notifications</h3>
      <p className="small">Pick what you want to hear about.</p>
      <div className="row">
        {topics.map(t => <TopicToggle key={t.id} topic={t}/>)}
      </div>
    </section>
  )
}
