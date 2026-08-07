import '@testing-library/jest-dom'
import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { getUpdates } from '@/data'
import UpdatesList from '../UpdatesList'

describe('UpdatesList', () => {
  it('links each paper title to its source URL in a grouped publication update', () => {
    const publicationUpdate = getUpdates().find(
      update => update.id === 'pub-group-pub-004-pub-005'
    )

    expect(publicationUpdate).toBeDefined()
    render(<UpdatesList updates={[publicationUpdate!]} />)

    fireEvent.click(screen.getByRole('button', { name: publicationUpdate!.title }))

    expect(
      screen.getAllByRole('button', { name: /^(Close modal|閉じる)$/ })
    ).toHaveLength(1)

    expect(screen.getByRole('link', { name: '学術論文において研究データを参照する論文引用の識別' }))
      .toHaveAttribute('href', 'https://www.anlp.jp/proceedings/annual_meeting/2026/pdf_dir/Q9-21.pdf')
    expect(screen.getByRole('link', { name: '研究活動で産出された論文と研究データの対応付け' }))
      .toHaveAttribute('href', 'https://www.anlp.jp/proceedings/annual_meeting/2026/pdf_dir/Q9-22.pdf')
    expect(screen.queryByText('関連リンク')).not.toBeInTheDocument()
  })
})
