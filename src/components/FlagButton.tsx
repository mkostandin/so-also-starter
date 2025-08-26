import React, { useState } from 'react'
import { sendFlag } from '../lib/reportFlag'

type TargetType = 'event'|'conference'|'session'|'series'

export function FlagButton(props: {
  targetType: TargetType
  targetId: string
  targetPath: string
  targetName?: string
  committeeSlug?: string | null
  compact?: boolean
}) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <button
        className={props.compact ? 'small' : 'btn secondary'}
        onClick={() => setOpen(true)}
        aria-label="Report an issue"
        style={props.compact ? {opacity:.75} : {}}
      >
        {props.compact ? 'Report an issue' : 'Report'}
      </button>
      {open && <FlagModal onClose={() => setOpen(false)} {...props} />}
    </>
  )
}

function FlagModal(
  { onClose, ...target }: { onClose: () => void } & Parameters<typeof FlagButton>[0]
) {
  const [reason, setReason] = useState('incorrect_time')
  const [message, setMessage] = useState('')
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [busy, setBusy] = useState(false)
  const [hp, setHp] = useState('') // honeypot

  async function submit() {
    if (busy) return
    setBusy(true)
    try {
      const deviceId = ensureDeviceId()
      await sendFlag({
        reason, message, contactEmail: email || null, deviceId, hp,
        ...target
      })
      setSent(true)
    } catch (e:any) {
      alert(e?.message || 'Could not send. Please try again later.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div style={overlayStyle}>
      <div className="card" style={modalStyle} role="dialog" aria-labelledby="flag-title">
        {sent ? (
          <>
            <h3 id="flag-title">Thanks!</h3>
            <p className="small">Our moderators will review this.</p>
            <div className="row" style={{justifyContent:'flex-end'}}>
              <button className="btn" onClick={onClose}>Close</button>
            </div>
          </>
        ) : (
          <>
            <h3 id="flag-title">Report an issue</h3>
            <label>Reason
              <select className="input" value={reason} onChange={e=>setReason(e.target.value)}>
                <option value="incorrect_time">Incorrect time</option>
                <option value="wrong_address">Wrong address</option>
                <option value="broken_link">Broken link</option>
                <option value="duplicate">Duplicate</option>
                <option value="not_ypaa">Not YPAA-related</option>
                <option value="inappropriate">Inappropriate</option>
                <option value="other">Other</option>
              </select>
            </label>
            <label>Describe (optional)
              <textarea className="input" rows={3} maxLength={500} value={message} onChange={e=>setMessage(e.target.value)} />
            </label>
            <label>Email (optional)
              <input className="input" type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.org"/>
            </label>
            {/* Honeypot (hidden) */}
            <label style={{position:'absolute', left:'-9999px'}}>Do not fill<input value={hp} onChange={e=>setHp(e.target.value)} /></label>
            <div className="row" style={{justifyContent:'flex-end', gap:8}}>
              <button className="btn secondary" onClick={onClose}>Cancel</button>
              <button className="btn" onClick={submit} disabled={busy}>{busy ? 'Sending…' : 'Send'}</button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

const overlayStyle: React.CSSProperties = {
  position:'fixed', inset:0, background:'rgba(0,0,0,.35)', zIndex:60,
  display:'flex', alignItems:'flex-end', justifyContent:'center', padding:'12px'
}
const modalStyle: React.CSSProperties = { maxWidth:560, width:'100%', borderRadius:16 }

function ensureDeviceId(){
  let id = localStorage.getItem('deviceId')
  if (!id) { id = crypto.randomUUID(); localStorage.setItem('deviceId', id) }
  return id
}
