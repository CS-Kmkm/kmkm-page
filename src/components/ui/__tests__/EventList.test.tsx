import '@testing-library/jest-dom'
import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import EventList from '../EventList'
import { EventCategory, type EventEntry } from '@/types'

const event = (overrides: Partial<EventEntry>): EventEntry => ({
  id: 'event',
  title: 'Event',
  description: 'Description',
  date: '2026-05-21',
  year: 2026,
  category: EventCategory.EVENT,
  displayDate: '2026-05-21',
  ...overrides,
})

const events = [
  event({ id: 'career', title: 'Career event', category: EventCategory.AFFILIATION }),
  event({ id: 'paper', title: 'Publication event', category: EventCategory.PUBLICATION }),
  event({ id: 'award', title: 'Award event', category: EventCategory.AWARD }),
]

describe('EventList', () => {
  it('shows all events until a category filter is selected', () => {
    render(<EventList events={events} />)

    expect(screen.getByText('3件 / 3件のイベントを表示')).toBeInTheDocument()
    expect(screen.getByText('Career event')).toBeInTheDocument()
    expect(screen.getByText('Publication event')).toBeInTheDocument()
    expect(screen.getByText('Award event')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: '論文' }))

    expect(screen.getByText('1件 / 3件のイベントを表示')).toBeInTheDocument()
    expect(screen.queryByText('Career event')).not.toBeInTheDocument()
    expect(screen.getByText('Publication event')).toBeInTheDocument()
  })

  it('clears an active category filter', () => {
    render(<EventList events={events} />)

    fireEvent.click(screen.getByRole('button', { name: '論文' }))
    fireEvent.click(screen.getByRole('button', { name: 'クリア' }))

    expect(screen.getByText('3件 / 3件のイベントを表示')).toBeInTheDocument()
    expect(screen.getByText('Career event')).toBeInTheDocument()
  })

  it('reports the filtered event and its index when an event is selected', () => {
    const onEventClick = vi.fn()
    render(<EventList events={events} onEventClick={onEventClick} />)

    fireEvent.click(screen.getByText('Publication event'))

    expect(onEventClick).toHaveBeenCalledWith(events[1], 1, events)
  })
})
