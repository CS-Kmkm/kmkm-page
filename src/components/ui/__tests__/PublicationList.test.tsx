import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import PublicationList from '../PublicationList'
import { PublicationEntry } from '@/types'

// Mock data for testing
const mockPublications: PublicationEntry[] = [
  {
    id: 'pub-001',
    title: 'Test Publication 1',
    authors: ['Koshi Motegi', 'Jane Smith'],
    venue: 'Test Journal',
    year: 2024,
    displayDate: '2024-01-01',
    doi: '10.1000/test.001',
    awards: [
      {
        title: 'Test Award',
        date: '2026-03-31',
        organization: 'Test Organization',
        url: 'https://example.com/award'
      }
    ],
    isFirstAuthor: true,
    isPeerReviewed: true,
    publicationType: 'journal'
  },
  {
    id: 'pub-002',
    title: 'Test Publication 2',
    authors: ['Jane Smith', 'John Doe', 'Bob Wilson'],
    venue: 'Test Conference',
    year: 2023,
    displayDate: '2023-01-01',
    isFirstAuthor: false,
    isPeerReviewed: false,
    publicationType: 'conference'
  },
  {
    id: 'pub-003',
    title: 'Test Publication 3',
    authors: ['茂木光志'],
    venue: 'Test Workshop',
    year: 2022,
    displayDate: '2022-01-01',
    doi: '10.1000/test.003',
    isFirstAuthor: true,
    isPeerReviewed: true,
    publicationType: 'workshop'
  }
]

describe('PublicationList', () => {
  it('renders publications correctly', () => {
    render(<PublicationList publications={mockPublications} />)

    // Check that all publication titles are rendered
    expect(screen.getByText('Test Publication 1')).toBeInTheDocument()
    expect(screen.getByText('Test Publication 2')).toBeInTheDocument()
    expect(screen.getByText('Test Publication 3')).toBeInTheDocument()

    // Check that venues are displayed
    expect(screen.getByText('Test Journal')).toBeInTheDocument()
    expect(screen.getByText('Test Conference')).toBeInTheDocument()
    expect(screen.getByText('Test Workshop')).toBeInTheDocument()

    // Check that years are displayed (using regex to be more flexible)
    expect(screen.getByText(/2024/)).toBeInTheDocument()
    expect(screen.getByText(/2023/)).toBeInTheDocument()
    expect(screen.getByText(/2022/)).toBeInTheDocument()
  })

  it('does not render metadata badges inside publication entries', () => {
    render(<PublicationList publications={mockPublications} />)

    const firstPublication = screen.getByRole('button', {
      name: 'Test Publication 1の詳細を表示'
    })

    expect(firstPublication).not.toHaveTextContent('第一著者')
    expect(firstPublication).not.toHaveTextContent('査読あり')
    expect(firstPublication).not.toHaveTextContent('ジャーナル')
    expect(firstPublication).not.toHaveTextContent('Test Award')
  })

  it('renders publication items correctly', () => {
    render(<PublicationList publications={mockPublications} />)

    // Check that publication items are clickable
    const publicationButtons = screen.getAllByRole('button', { name: /の詳細を表示/ })
    expect(publicationButtons).toHaveLength(3)

    // Check that publication items have correct aria-labels
    expect(screen.getByRole('button', { name: 'Test Publication 1の詳細を表示' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Test Publication 2の詳細を表示' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Test Publication 3の詳細を表示' })).toBeInTheDocument()
  })

  it('has proper accessibility attributes', () => {
    render(<PublicationList publications={mockPublications} />)

    // Check that publication items have proper accessibility attributes
    const publicationButtons = screen.getAllByRole('button', { name: /の詳細を表示/ })
    expect(publicationButtons).toHaveLength(3)

    // Check that each publication button has proper tabindex and aria-label
    publicationButtons.forEach((button, index) => {
      expect(button).toHaveAttribute('tabindex', '0')
      expect(button).toHaveAttribute('aria-label', `Test Publication ${index + 1}の詳細を表示`)
    })
  })

  it('sorts publications by year (newest first)', () => {
    render(<PublicationList publications={mockPublications} />)

    const publicationButtons = screen.getAllByRole('button', { name: /の詳細を表示/ })
    const titles = publicationButtons.map(button =>
      button.querySelector('h3')?.textContent
    )

    // Should be sorted by year: 2024, 2023, 2022
    expect(titles).toEqual([
      'Test Publication 1', // 2024
      'Test Publication 2', // 2023
      'Test Publication 3'  // 2022
    ])
  })

  it('displays filters correctly', () => {
    render(<PublicationList publications={mockPublications} />)

    // Check for filter buttons
    expect(screen.getByRole('group', { name: '著者区分' })).toBeInTheDocument()
    expect(screen.getByRole('group', { name: '査読区分' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '主著' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '共著' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'あり' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'なし' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: '国内' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: '国外' })).not.toBeInTheDocument()
  })

  it('removes modal badges while preserving the award source link', () => {
    render(<PublicationList publications={mockPublications} />)

    fireEvent.click(screen.getByRole('button', { name: 'Test Publication 1の詳細を表示' }))

    const dialog = screen.getByRole('dialog')
    expect(dialog).not.toHaveTextContent('第一著者')
    expect(dialog).not.toHaveTextContent('査読あり')
    expect(dialog).not.toHaveTextContent('ジャーナル')
    expect(screen.getAllByText('Test Award')).toHaveLength(1)
    expect(screen.getByRole('link', { name: 'Test Award' })).toHaveAttribute(
      'href',
      'https://example.com/award'
    )
  })

  it('filters publications correctly when filter is selected', () => {
    render(<PublicationList publications={mockPublications} />)

    // Click on first author filter
    fireEvent.click(screen.getByRole('button', { name: '主著' }))

    expect(screen.queryByRole('button', { name: 'クリア' })).not.toBeInTheDocument()

    // Should only show first author publications
    expect(screen.getByText('Test Publication 1')).toBeInTheDocument()
    expect(screen.queryByText('Test Publication 2')).not.toBeInTheDocument()
    expect(screen.getByText('Test Publication 3')).toBeInTheDocument()

    // Check results count
    expect(screen.getByText('2 / 3件')).toBeInTheDocument()
  })

  it('has proper aria-pressed attributes on filter buttons', () => {
    render(<PublicationList publications={mockPublications} />)

    const firstAuthorButton = screen.getByRole('button', { name: '主著' })
    const peerReviewedButton = screen.getByRole('button', { name: 'あり' })

    // Initially filters should not be pressed
    expect(firstAuthorButton).toHaveAttribute('aria-pressed', 'false')
    expect(peerReviewedButton).toHaveAttribute('aria-pressed', 'false')

    // Click first author filter
    fireEvent.click(firstAuthorButton)

    // Now first author should be pressed
    expect(firstAuthorButton).toHaveAttribute('aria-pressed', 'true')
    expect(peerReviewedButton).toHaveAttribute('aria-pressed', 'false')
  })

  it('displays empty state when no publications match filter', () => {
    render(<PublicationList publications={mockPublications} />)

    // Click on non-peer-reviewed filter - should show only 1 publication
    fireEvent.click(screen.getByRole('button', { name: 'なし' }))

    // Should show only the non-peer-reviewed publication
    expect(screen.getByText('Test Publication 2')).toBeInTheDocument()
    expect(screen.queryByText('Test Publication 1')).not.toBeInTheDocument()
    expect(screen.queryByText('Test Publication 3')).not.toBeInTheDocument()
    expect(screen.getByText('1 / 3件')).toBeInTheDocument()
  })

  it('handles empty publications array', () => {
    render(<PublicationList publications={[]} />)

    // Should show empty state
    expect(screen.getByText('論文が見つかりません')).toBeInTheDocument()
  })

  it('formats authors correctly for non-first-author publications', () => {
    render(<PublicationList publications={mockPublications} />)

    // For pub-002 (not first author), authors should be plain text
    const authorText = screen.getByText('Jane Smith, John Doe, Bob Wilson')
    expect(authorText).toBeInTheDocument()
    expect(authorText.querySelector('strong')).toBeNull()
  })
})
