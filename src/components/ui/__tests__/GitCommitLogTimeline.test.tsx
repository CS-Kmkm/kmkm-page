import '@testing-library/jest-dom'
import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { EventCategory, type EventEntry, type ExtendedCareerEntry } from '@/types'
import GitCommitLogTimeline from '../GitCommitLogTimeline'

const entries: ExtendedCareerEntry[] = [
  {
    id: 'career',
    year: '2026',
    organization: 'University',
    role: 'Student',
    startDate: '2026-01-01',
    endDate: '2026-12-31',
    displayDate: '2026-01-01',
  },
]

const events: EventEntry[] = [
  {
    id: 'publication',
    title: 'Paper event',
    description: 'Paper titleを第一著者として発表',
    date: '2026-05-12',
    year: 2026,
    category: EventCategory.PUBLICATION,
    displayDate: '2026-05-12',
    publicationLinks: [
      {
        title: 'Paper title',
        url: 'https://example.com/paper',
      },
    ],
  },
]

describe('GitCommitLogTimeline', () => {
  it('links the paper title to its source URL in the event details', () => {
    render(<GitCommitLogTimeline entries={entries} events={events} />)

    fireEvent.click(screen.getByRole('button', { name: '2026年のイベント1件を表示' }))
    fireEvent.click(screen.getByRole('button', { name: 'Paper event - View event details' }))

    expect(screen.getByRole('link', { name: 'Paper title' }))
      .toHaveAttribute('href', 'https://example.com/paper')
    expect(screen.queryByText('関連リンク')).not.toBeInTheDocument()
  })
})
