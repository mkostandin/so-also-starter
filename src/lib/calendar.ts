export type CalendarEventItem = {
  id: string
  name: string
  type: string
  startUTC: string
  endUTC: string
  city?: string
}

export type CalendarDay = {
  date: Date
  dateKey: string
  isCurrentMonth: boolean
  events: CalendarEventItem[]
}

/**
 * Generate array of days for a month view (35-42 days to fill 6 weeks)
 */
export function getMonthDays(year: number, month: number): CalendarDay[] {
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const startDate = new Date(firstDay)

  // Find the first Monday (or adjust to start on Sunday if preferred)
  const dayOfWeek = startDate.getDay()
  const diff = startDate.getDay() === 0 ? -6 : 1 - startDate.getDay() // Start on Monday
  startDate.setDate(startDate.getDate() + diff)

  const days: CalendarDay[] = []
  const endDate = new Date(lastDay)

  // Extend to cover 6 weeks (42 days total)
  endDate.setDate(endDate.getDate() + (41 - (lastDay.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)))

  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    const dateKey = toLocalDateKey(d.toISOString())
    days.push({
      date: new Date(d),
      dateKey,
      isCurrentMonth: d.getMonth() === month,
      events: []
    })
  }

  return days
}

/**
 * Group events by local date keys
 */
export function groupEventsByDate(events: CalendarEventItem[]): Map<string, CalendarEventItem[]> {
  const map = new Map<string, CalendarEventItem[]>()
  for (const event of events) {
    const key = toLocalDateKey(event.startUTC)
    const arr = map.get(key) || []
    arr.push(event)
    map.set(key, arr)
  }
  return map
}

/**
 * Convert UTC date string to local date key (YYYY-MM-DD)
 */
export function toLocalDateKey(iso: string): string {
  const d = new Date(iso)
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

/**
 * Truncate event name for display in calendar cells
 */
export function getEventDisplayText(event: CalendarEventItem, maxLength: number = 18): string {
  if (event.name.length <= maxLength) {
    return event.name
  }
  return event.name.substring(0, maxLength - 3) + '...'
}

/**
 * Format date for calendar headers (Month YYYY)
 */
export function formatCalendarDate(date: Date): string {
  return date.toLocaleDateString(undefined, { year: 'numeric', month: 'long' })
}

/**
 * Format weekday name for calendar headers
 */
export function formatWeekday(date: Date): string {
  return date.toLocaleDateString(undefined, { weekday: 'short' })
}

/**
 * Check if a date is today
 */
export function isToday(date: Date): boolean {
  const today = new Date()
  return date.getDate() === today.getDate() &&
         date.getMonth() === today.getMonth() &&
         date.getFullYear() === today.getFullYear()
}

/**
 * Get the next month
 */
export function getNextMonth(currentDate: Date): Date {
  return new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
}

/**
 * Get the previous month
 */
export function getPreviousMonth(currentDate: Date): Date {
  return new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
}

/**
 * Get current month and year
 */
export function getCurrentMonth(): Date {
  const now = new Date()
  return new Date(now.getFullYear(), now.getMonth(), 1)
}

/**
 * Format time range for display (e.g., "2:00 PM - 5:00 PM")
 */
export function formatTimeRange(startUTC: string, endUTC: string): string {
  const start = new Date(startUTC)
  const end = new Date(endUTC)

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString(undefined, {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
  }

  return `${formatTime(start)} - ${formatTime(end)}`
}