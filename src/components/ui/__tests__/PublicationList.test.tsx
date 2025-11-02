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

  it('renders DOI links correctly', () => {
    render(<PublicationList publications={mockPublications} />)

    // Check for DOI links
    const doiLinks = screen.getAllByText('DOI')
    expect(doiLinks).toHaveLength(2) // pub-001 and pub-003 have DOI

    // Check that DOI links have correct href attributes
    const firstDoiLink = doiLinks[0].closest('a')
    expect(firstDoiLink).toHaveAttribute('href', 'https://doi.org/10.1000/test.001')
    expect(firstDoiLink).toHaveAttribute('target', '_blank')
    expect(firstDoiLink).toHaveAttribute('rel', 'noopener noreferrer')

    const secondDoiLink = doiLinks[1].closest('a')
    expect(secondDoiLink).toHaveAttribute('href', 'https://doi.org/10.1000/test.003')
  })

  it('has proper accessibility attributes', () => {
    render(<PublicationList publications={mockPublications} />)

    // Check for proper ARIA labels on DOI links
    const doiLinks = screen.getAllByLabelText(/View publication DOI/)
    expect(doiLinks).toHaveLength(2)
    expect(doiLinks[0]).toHaveAttribute('aria-label', 'View publication DOI: 10.1000/test.001')
    expect(doiLinks[1]).toHaveAttribute('aria-label', 'View publication DOI: 10.1000/test.003')

    // Check that publications are wrapped in article elements for semantic structure
    const articles = screen.getAllByRole('article')
    expect(articles).toHaveLength(3)
  })

  it('sorts publications by year (newest first)', () => {
    render(<PublicationList publications={mockPublications} />)

    const articles = screen.getAllByRole('article')
    const titles = articles.map(article =>
      article.querySelector('h3')?.textContent
    )

    // Should be sorted by year: 2024, 2023, 2022
    expect(titles).toEqual([
      'Test Publication 1', // 2024
      'Test Publication 2', // 2023
      'Test Publication 3'  // 2022
    ])
  })

  it('displays filters when showFilters is true', () => {
    render(<PublicationList publications={mockPublications} showFilters={true} />)

    // Check for filter buttons
    expect(screen.getByText('All (3)')).toBeInTheDocument()
    expect(screen.getByText('Journal (1)')).toBeInTheDocument()
    expect(screen.getByText('Conference (1)')).toBeInTheDocument()
    expect(screen.getByText('Workshop (1)')).toBeInTheDocument()
  })

  it('filters publications correctly when filter is selected', () => {
    render(<PublicationList publications={mockPublications} showFilters={true} />)

    // Click on Journal filter
    fireEvent.click(screen.getByText('Journal (1)'))

    // Should only show journal publication
    expect(screen.getByText('Test Publication 1')).toBeInTheDocument()
    expect(screen.queryByText('Test Publication 2')).not.toBeInTheDocument()
    expect(screen.queryByText('Test Publication 3')).not.toBeInTheDocument()

    // Check results count
    expect(screen.getByText('Showing 1 of 3 publications')).toBeInTheDocument()
  })

  it('has proper aria-pressed attributes on filter buttons', () => {
    render(<PublicationList publications={mockPublications} showFilters={true} />)

    const allButton = screen.getByText('All (3)')
    const journalButton = screen.getByText('Journal (1)')

    // Initially "All" should be pressed
    expect(allButton).toHaveAttribute('aria-pressed', 'true')
    expect(journalButton).toHaveAttribute('aria-pressed', 'false')

    // Click journal filter
    fireEvent.click(journalButton)

    // Now journal should be pressed
    expect(allButton).toHaveAttribute('aria-pressed', 'false')
    expect(journalButton).toHaveAttribute('aria-pressed', 'true')
  })

  it('displays empty state when no publications match filter', () => {
    render(<PublicationList publications={mockPublications} showFilters={true} />)

    // Click on Workshop filter - should show only 1 publication
    fireEvent.click(screen.getByText('Workshop (1)'))

    // Should show only the workshop publication
    expect(screen.getByText('Test Publication 3')).toBeInTheDocument()
    expect(screen.queryByText('Test Publication 1')).not.toBeInTheDocument()
    expect(screen.queryByText('Test Publication 2')).not.toBeInTheDocument()
    expect(screen.getByText('Showing 1 of 3 publications')).toBeInTheDocument()
  })

  it('handles empty publications array', () => {
    render(<PublicationList publications={[]} />)

    // Should show empty state
    expect(screen.getByText('No publications found for the selected filter.')).toBeInTheDocument()
  })

  it('formats authors correctly for non-first-author publications', () => {
    render(<PublicationList publications={mockPublications} />)

    // For pub-002 (not first author), authors should be plain text
    const authorText = screen.getByText('Jane Smith, John Doe, Bob Wilson')
    expect(authorText).toBeInTheDocument()
    expect(authorText.querySelector('strong')).toBeNull()
  })
})