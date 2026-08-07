import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import EventDetailModal from '../EventDetailModal'
import { EventCategory, type EventEntry } from '@/types'

const events: EventEntry[] = [
  {
    id: 'first',
    title: 'First event',
    description: 'First description',
    date: '2026-01-01',
    year: 2026,
    category: EventCategory.EVENT,
    displayDate: '2026-01-01',
  },
  {
    id: 'second',
    title: 'Second event',
    description: 'Paper titleを第一著者として発表',
    date: '2026-02-01',
    year: 2026,
    category: EventCategory.PUBLICATION,
    displayDate: '2026-02-01',
    location: 'Online',
    publicationLinks: [
      {
        title: 'Paper title',
        url: 'https://example.com/paper',
      },
    ],
    tags: ['research'],
  },
  {
    id: 'third',
    title: 'Third event',
    description: 'Third description',
    date: '2026-03-01',
    year: 2026,
    category: EventCategory.AWARD,
    displayDate: '2026-03-01',
  },
]

describe('EventDetailModal', () => {
  it('renders nothing when it is closed or has no event', () => {
    const { rerender } = render(
      <EventDetailModal
        isOpen={false}
        event={events[0]}
        eventIndex={0}
        filteredEvents={events}
        onClose={vi.fn()}
      />,
    )

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()

    rerender(
      <EventDetailModal
        isOpen
        event={null}
        eventIndex={0}
        filteredEvents={events}
        onClose={vi.fn()}
      />,
    )

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('shows event details and navigates with arrow keys', () => {
    const onNavigate = vi.fn()
    render(
      <EventDetailModal
        isOpen
        event={events[1]}
        eventIndex={1}
        filteredEvents={events}
        onClose={vi.fn()}
        onNavigate={onNavigate}
      />,
    )

    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Second event' })).toBeInTheDocument()
    expect(screen.getByText('Online')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Paper title' }))
      .toHaveAttribute('href', 'https://example.com/paper')
    expect(screen.queryByText('関連リンク')).not.toBeInTheDocument()
    expect(screen.getByText('#research')).toBeInTheDocument()
    expect(screen.getByText('2 / 3')).toBeInTheDocument()

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft' }))
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }))

    expect(onNavigate).toHaveBeenNthCalledWith(1, 0)
    expect(onNavigate).toHaveBeenNthCalledWith(2, 2)
  })
})
