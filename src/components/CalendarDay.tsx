import React from 'react'
import { CalendarDay as CalendarDayType, CalendarEventItem, getEventDisplayText, isToday } from '../lib/calendar'

type CalendarDayProps = {
  day: CalendarDayType
  onEventClick?: (event: CalendarEventItem) => void
  onMultipleEventsClick?: (events: CalendarEventItem[], dateKey: string) => void
}

export default function CalendarDay({ day, onEventClick, onMultipleEventsClick }: CalendarDayProps) {
  const { date, dateKey, isCurrentMonth, events } = day
  const dayNumber = date.getDate()
  const isCurrentDay = isToday(date)

  const handleDayClick = (e: React.MouseEvent) => {
    // If there are multiple events, let the event count badge handle it
    if (events.length > 1) {
      e.stopPropagation()
      onMultipleEventsClick?.(events, dateKey)
      return
    }

    // If there's a single event, navigate to it
    if (events.length === 1) {
      e.stopPropagation()
      onEventClick?.(events[0])
    }
  }

  const handleEventClick = (e: React.MouseEvent, event: CalendarEventItem) => {
    e.stopPropagation()
    onEventClick?.(event)
  }

  const handleMultipleEventsClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    onMultipleEventsClick?.(events, dateKey)
  }

  const dayClasses = [
    'calendar-day',
    !isCurrentMonth && 'other-month',
    isCurrentDay && 'today'
  ].filter(Boolean).join(' ')

  return (
    <div className={dayClasses} onClick={handleDayClick}>
      <div className="calendar-day-number">{dayNumber}</div>

      {events.length === 1 && (
        <a
          href={`/app/e/${events[0].id}`}
          className="calendar-event"
          onClick={(e) => handleEventClick(e, events[0])}
          title={events[0].name}
        >
          {getEventDisplayText(events[0])}
        </a>
      )}

      {events.length > 1 && (
        <div
          className="calendar-event-count"
          onClick={handleMultipleEventsClick}
          title={`${events.length} events on this day`}
        >
          {events.length} events
        </div>
      )}
    </div>
  )
}
