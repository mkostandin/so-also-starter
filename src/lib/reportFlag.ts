type Payload = {
    targetType: 'event'|'conference'|'session'|'series'
    targetId: string
    targetPath: string
    targetName?: string
    committeeSlug?: string | null
    reason: string
    message?: string
    contactEmail?: string | null
    deviceId?: string
    hp?: string // honeypot
  }
  
  export async function sendFlag(data: Payload){
    const id = data.deviceId || 'unknown'
    const key = `rl:flags:${id}`
    const now = Date.now()
    const raw = localStorage.getItem(key)
    let s = raw ? JSON.parse(raw) as { count:number, resetAt:number } : { count: 0, resetAt: now + 86400000 }
    if (s.resetAt < now) s = { count: 0, resetAt: now + 86400000 }
    if (s.count >= 3) throw new Error('Too many reports today. Please try again tomorrow.')
    s.count += 1
    localStorage.setItem(key, JSON.stringify(s))
    if (data.hp) return
    await new Promise(r => setTimeout(r, 300))
    // Real path:
    // import { httpsCallable } from 'firebase/functions'
    // const reportFlag = httpsCallable(functions, 'reportFlag')
    // await reportFlag(data)
  }
  