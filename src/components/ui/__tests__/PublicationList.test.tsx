import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import PublicationList from '../PublicationList'
import { PublicationEntry } from '@/types'

// Mock data for testing
const mockPublications: PublicationEntry[] = [
  {
    id: 'pub-001',
    title: 'Test Publication 1',
    authors: ['John Doe', 'Jane Smith'],
    venue: 'Test Journal',
    year: 2024,
    doi: '10.1000/test.001',
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
    isFirstAuthor: false,
    isPeerReviewed: false,
    publicationType: 'conference'
  },
  {
    id: 'pub-003',
    title: 'Test Publication 3',
    authors: ['Alice Brown'],
    venue: 'Test Workshop',
    year: 2022,
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

  it('displays author status badges correctly', () => {
    render(<PublicationList publications={mockPublications} />)

    // Check for first author badges
    const firstAuthorBadges = screen.getAllByText('First Author')
    expect(firstAuthorBadges).toHaveLength(2) // pub-001 and pub-003 are first author

    // Check that first author names are wrapped in strong tags
    const johnDoeElement = screen.getByText('John Doe')
    const aliceBrownElement = screen.getByText('Alice Brown')
    expect(johnDoeElement.tagName).toBe('STRONG')
    expect(aliceBrownElement.tagName).toBe('STRONG')
  })

  it('displays peer-review badges correctly', () => {
    render(<PublicationList publications={mockPublications} />)

    // Check for peer reviewed badges
    const peerReviewedBadges = screen.getAllByText('Peer Reviewed')
    expect(peerReviewedBadges).toHaveLength(2) // pub-001 and pub-003 are peer reviewed
  })

  it('displays publication type badges correctly', () => {
    render(<PublicationList publications={mockPublications} />)

    // Check for publication type badges
    expect(screen.getByText('Journal')).toBeInTheDocument()
    expect(screen.getByText('Conference')).toBeInTheDocument()
    expect(screen.getByText('Workshop')).toBeInTheDocument()
  })

  it('renders publication items correctly', () => {
    render(<PublicationList publications={mockPublications} />)

    // Check that publication items are clickable
    const publicationButtons = screen.getAllByRole('button', { name: /View details for/ })
    expect(publicationButtons).toHaveLength(3)

    // Check that publication items have correct aria-labels
    expect(screen.getByRole('button', { name: 'View details for Test Publication 1' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'View details for Test Publication 2' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'View details for Test Publication 3' })).toBeInTheDocument()
  })

  it('has proper accessibility attributes', () => {
    render(<PublicationList publications={mockPublications} />)

    // Check that publication items have proper accessibility attributes
    const publicationButtons = screen.getAllByRole('button', { name: /View details for/ })
    expect(publicationButtons).toHaveLength(3)

    // Check that each publication button has proper tabindex and aria-label
    publicationButtons.forEach((button, index) => {
      expect(button).toHaveAttribute('tabindex', '0')
      expect(button).toHaveAttribute('aria-label', `View details for Test Publication ${index + 1}`)
    })
  })

  it('sorts publications by year (newest first)', () => {
    render(<PublicationList publications={mockPublications} />)

    const publicationButtons = screen.getAllByRole('button', { name: /View details for/ })
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
    expect(screen.getByText('第一著者')).toBeInTheDocument()
    expect(screen.getByText('共著者')).toBeInTheDocument()
    expect(screen.getByText('査読あり')).toBeInTheDocument()
    expect(screen.getByText('査読なし')).toBeInTheDocument()
  })

  it('filters publications correctly when filter is selected', () => {
    render(<PublicationList publications={mockPublications} />)

    // Click on first author filter
    fireEvent.click(screen.getByText('第一著者'))

    // Should only show first author publications
    expect(screen.getByText('Test Publication 1')).toBeInTheDocument()
    expect(screen.queryByText('Test Publication 2')).not.toBeInTheDocument()
    expect(screen.getByText('Test Publication 3')).toBeInTheDocument()

    // Check results count
    expect(screen.getByText('2件 / 3件の論文を表示')).toBeInTheDocument()
  })

  it('has proper aria-pressed attributes on filter buttons', () => {
    render(<PublicationList publications={mockPublications} />)

    const firstAuthorButton = screen.getByText('第一著者')
    const peerReviewedButton = screen.getByText('査読あり')

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
    fireEvent.click(screen.getByText('査読なし'))

    // Should show only the non-peer-reviewed publication
    expect(screen.getByText('Test Publication 2')).toBeInTheDocument()
    expect(screen.queryByText('Test Publication 1')).not.toBeInTheDocument()
    expect(screen.queryByText('Test Publication 3')).not.toBeInTheDocument()
    expect(screen.getByText('1件 / 3件の論文を表示')).toBeInTheDocument()
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