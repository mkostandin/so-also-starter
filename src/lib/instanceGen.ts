import { Freq, Weekday, nthWeekdayOfMonth, weekdayToIndex, addDaysUTC } from './recurrence'

type GenInput = {
  name: string
  type: 'Committee Meeting'|'YPAA Meeting'
  timezone: string
  startTimeLocal: string // 'HH:mm'
  durationMins: number
  rRule: {
    freq: Freq
    interval: number
    byWeekday: Weekday[]
    bySetPos: number[] // for monthly
    byMonth: number[]
    until: string | null
    count: number | null
  }
  startMonth: string // 'YYYY-MM'
  monthsAhead: number
}

type Instance = {
  startsAtLocal: string
  endsAtLocal: string
  startUTC: string
  endUTC: string
}

function toLocalDateTimeISO(dateLocalYMD: string, timeLocal: string, tz: string){
  // build a local time string and convert via Intl (approx; for production consider a TZ library)
  const [Y,M,D] = dateLocalYMD.split('-').map(n=>parseInt(n,10))
  const [h,m] = timeLocal.split(':').map(n=>parseInt(n,10))
  const dt = new Date(Date.UTC(Y, M-1, D, h, m))
  // We *approximate* local/UTC using the host TZ offset at that moment:
  const fmt = new Intl.DateTimeFormat('en-US', { timeZone: tz, hour12:false, year:'numeric', month:'2-digit', day:'2-digit', hour:'2-digit', minute:'2-digit' })
  const parts = fmt.formatToParts(dt).reduce((acc:any,p)=>{acc[p.type]=p.value; return acc}, {})
  const localIso = `${parts.year}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}:00`
  const utc = new Date(dt.toLocaleString('en-US', { timeZone: tz }))
  const offsetMs = dt.getTime() - utc.getTime()
  const startUtcDate = new Date(dt.getTime() - offsetMs)
  return { localIso, utcIso: startUtcDate.toISOString() }
}

export function generateInstancesForMonths(input: GenInput): Instance[] {
  const out: Instance[] = []
  const [startY, startM] = input.startMonth.split('-').map(n=>parseInt(n,10))
  const months = input.monthsAhead
  const untilTime = input.rRule.until ? new Date(input.rRule.until+'T23:59:59Z').getTime() : null
  let count = 0

  for (let i=0; i<months; i++){
    const y = startY + Math.floor((startM - 1 + i)/12)
    const m0 = (startM - 1 + i) % 12

    if (input.rRule.freq === 'weekly'){
      // pick first day of month in target TZ and iterate days
      const firstUTC = new Date(Date.UTC(y, m0, 1))
      for (let d=0; d<31; d++){
        const cur = addDaysUTC(firstUTC, d)
        if (cur.getUTCMonth() !== m0) break
        const dow = cur.getUTCDay()
        const match = input.rRule.byWeekday.some(w => weekdayToIndex(w) === dow)
        if (!match) continue
        if ((i % input.rRule.interval) !== 0) continue
        const ymd = `${cur.getUTCFullYear()}-${String(cur.getUTCMonth()+1).padStart(2,'0')}-${String(cur.getUTCDate()).padStart(2,'0')}`
        const { localIso, utcIso } = toLocalDateTimeISO(ymd, input.startTimeLocal, input.timezone)
        const endUtc = new Date(new Date(utcIso).getTime() + input.durationMins*60000).toISOString()
        if (untilTime && new Date(utcIso).getTime() > untilTime) return out
        out.push({ startsAtLocal: localIso, endsAtLocal: incrementLocal(localIso, input.durationMins), startUTC: utcIso, endUTC: endUtc })
        if (input.rRule.count && ++count >= input.rRule.count) return out
      }
    } else {
      // monthly nth-weekday
      for (const pos of input.rRule.bySetPos){
        for (const w of input.rRule.byWeekday){
          const d = nthWeekdayOfMonth(y, m0, w, pos)
          if (!d) continue
          if ((i % input.rRule.interval) !== 0) continue
          const ymd = `${d.getUTCFullYear()}-${String(d.getUTCMonth()+1).padStart(2,'0')}-${String(d.getUTCDate()).padStart(2,'0')}`
          const { localIso, utcIso } = toLocalDateTimeISO(ymd, input.startTimeLocal, input.timezone)
          const endUtc = new Date(new Date(utcIso).getTime() + input.durationMins*60000).toISOString()
          if (untilTime && new Date(utcIso).getTime() > untilTime) return out
          out.push({ startsAtLocal: localIso, endsAtLocal: incrementLocal(localIso, input.durationMins), startUTC: utcIso, endUTC: endUtc })
          if (input.rRule.count && ++count >= input.rRule.count) return out
        }
      }
    }
  }
  return out.sort((a,b)=>a.startUTC.localeCompare(b.startUTC))
}

function incrementLocal(localIso:string, addMins:number){
  const d = new Date(localIso.replace('T',' ') + 'Z') // treat as UTC-like then add minutes
  const e = new Date(d.getTime() + addMins*60000)
  return e.toISOString().slice(0,16).replace('T','T')
}
