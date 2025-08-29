import React, { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  CalendarEventItem,
  getMonthDays,
  groupEventsByDate,
  formatCalendarDate,
  getPreviousMonth,
  getNextMonth,
  getCurrentMonth
} from '../lib/calendar'
import CalendarDay from '../components/CalendarDay'
import DayEventsModal from '../components/DayEventsModal'

// Placeholder demo data; replace with Firestore merged query
const demoEvents: CalendarEventItem[] = [
  { id:'a', name:'YPAA Fall Kickoff', type:'Event', startUTC:'2025-10-18T22:00:00Z', endUTC:'2025-10-19T02:00:00Z', city:'Manchester, NH' },
  { id:'b', name:'Monthly Committee', type:'Committee Meeting', startUTC:'2025-09-12T23:00:00Z', endUTC:'2025-09-13T00:00:00Z', city:'Concord, NH' },
  { id:'c', name:'Area Roundup', type:'Event', startUTC:'2025-09-13T18:00:00Z', endUTC:'2025-09-13T21:00:00Z', city:'Nashua, NH' },
  { id:'d', name:'Regional Conference', type:'Conference', startUTC:'2025-09-15T09:00:00Z', endUTC:'2025-09-15T17:00:00Z', city:'Boston, MA' },
  { id:'e', name:'Workshop Session', type:'Workshop', startUTC:'2025-09-20T14:00:00Z', endUTC:'2025-09-20T16:00:00Z', city:'Portsmouth, NH' },
]

export default function CalendarView() {
  const navigate = useNavigate()
  const [currentDate, setCurrentDate] = useState(getCurrentMonth)
  const [selectedDay, setSelectedDay] = useState<{ events: CalendarEventItem[], dateKey: string } | null>(null)

  const { days, monthEvents } = useMemo(() => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()

    // Get all days for the current month view
    const calendarDays = getMonthDays(year, month)

    // Filter events for this month and group by date
    const monthStart = new Date(year, month, 1)
    const monthEnd = new Date(year, month + 1, 0)
    const monthEventsFiltered = demoEvents.filter(event => {
      const eventDate = new Date(event.startUTC)
      return eventDate >= monthStart && eventDate <= monthEnd
    })

    const eventGroups = groupEventsByDate(monthEventsFiltered)

    // Assign events to calendar days
    const daysWithEvents = calendarDays.map(day => ({
      ...day,
      events: eventGroups.get(day.dateKey) || []
    }))

    return {
      days: daysWithEvents,
      monthEvents: monthEventsFiltered
    }
  }, [currentDate])

  const handlePreviousMonth = () => {
    setCurrentDate(getPreviousMonth(currentDate))
  }

  const handleNextMonth = () => {
    setCurrentDate(getNextMonth(currentDate))
  }

  const handleToday = () => {
    setCurrentDate(getCurrentMonth())
  }

  const handleEventClick = (event: CalendarEventItem) => {
    navigate(`/app/e/${event.id}`)
  }

  const handleMultipleEventsClick = (events: CalendarEventItem[], dateKey: string) => {
    setSelectedDay({ events, dateKey })
  }

  const closeModal = () => {
    setSelectedDay(null)
  }

  const weekdayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <button
          className="calendar-nav-btn"
          onClick={handlePreviousMonth}
          aria-label="Previous month"
        >
          ‹
        </button>

        <h2 className="calendar-title">{formatCalendarDate(currentDate)}</h2>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            className="btn secondary"
            onClick={handleToday}
            style={{ fontSize: '12px', padding: '6px 12px' }}
          >
            Today
          </button>
          <button
            className="calendar-nav-btn"
            onClick={handleNextMonth}
            aria-label="Next month"
          >
            ›
          </button>
        </div>
      </div>

      <div className="calendar-grid">
        {/* Weekday headers */}
        {weekdayLabels.map(day => (
          <div key={day} className="calendar-weekday">
            {day}
          </div>
        ))}

        {/* Calendar days */}
        {days.map(day => (
          <CalendarDay
            key={day.dateKey}
            day={day}
            onEventClick={handleEventClick}
            onMultipleEventsClick={handleMultipleEventsClick}
          />
        ))}
      </div>

      {/* Day Events Modal */}
      <DayEventsModal
        isOpen={selectedDay !== null}
        onClose={closeModal}
        events={selectedDay?.events || []}
        dateKey={selectedDay?.dateKey || ''}
        onEventClick={handleEventClick}
      />
    </div>
  )
}


