export type Weekday = 'SU'|'MO'|'TU'|'WE'|'TH'|'FR'|'SA'
export type Freq = 'weekly'|'monthly'

export function weekdayToIndex(w:Weekday){ return ['SU','MO','TU','WE','TH','FR','SA'].indexOf(w) }

export function nthWeekdayOfMonth(year:number, month0:number, weekday:Weekday, n:number){
  const targetDow = weekdayToIndex(weekday)
  const first = new Date(Date.UTC(year, month0, 1))
  const shift = (7 + targetDow - first.getUTCDay()) % 7
  const day = 1 + shift + (n - 1) * 7
  const d = new Date(Date.UTC(year, month0, day))
  return (d.getUTCMonth() === month0) ? d : null
}

export function addDaysUTC(d:Date, days:number){
  const r = new Date(d.getTime()); r.setUTCDate(r.getUTCDate()+days); return r
}
