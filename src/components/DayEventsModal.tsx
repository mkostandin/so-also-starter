import React from 'react'
import { CalendarEventItem, formatTimeRange } from '../lib/calendar'

type DayEventsModalProps = {
  isOpen: boolean
  onClose: () => void
  events: CalendarEventItem[]
  dateKey: string
  onEventClick?: (event: CalendarEventItem) => void
}

export default function DayEventsModal({
  isOpen,
  onClose,
  events,
  dateKey,
  onEventClick
}: DayEventsModalProps) {
  if (!isOpen) return null

  const [year, month, day] = dateKey.split('-').map(Number)
  const date = new Date(year, month - 1, day)
  const formattedDate = date.toLocaleDateString(undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  const handleEventClick = (event: CalendarEventItem) => {
    onEventClick?.(event)
    onClose()
  }

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div className="day-modal-overlay" onClick={handleOverlayClick}>
      <div className="day-modal-content">
        <div className="day-modal-header">
          <h2 className="day-modal-title">{formattedDate}</h2>
          <button
            className="day-modal-close"
            onClick={onClose}
            aria-label="Close modal"
          >
            ×
          </button>
        </div>

        <div className="day-modal-body">
          {events.length === 0 ? (
            <p style={{ color: '#d1d5db', textAlign: 'center', padding: '20px' }}>
              No events on this day
            </p>
          ) : (
            events.map((event) => (
              <a
                key={event.id}
                href={`/app/e/${event.id}`}
                className="day-modal-event"
                onClick={(e) => {
                  e.preventDefault()
                  handleEventClick(event)
                }}
              >
                <div className="day-modal-event-title">{event.name}</div>
                <div className="day-modal-event-details">
                  {formatTimeRange(event.startUTC, event.endUTC)}
                  {event.city && ` • ${event.city}`}
                </div>
                <div className="day-modal-event-type">{event.type}</div>
              </a>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
