import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import ProjectModal from '../ProjectModal'
import type { ProjectDetail } from '@/types'

const project: ProjectDetail = {
  id: 'project',
  name: 'Project',
  description: 'Project description',
  technologies: ['TypeScript'],
  duration: '2026',
  role: 'Developer',
  date: '2026-01-01',
  displayDate: '2026-01-01',
  imageUrl: '/project.png',
}

describe('ProjectModal', () => {
  it('aligns full-width media with responsive modal padding', () => {
    render(<ProjectModal project={project} isOpen onClose={vi.fn()} />)

    expect(screen.getByAltText('Screenshot of Project').parentElement).toHaveClass(
      '-mx-4',
      '-mt-4',
      'sm:-mx-6',
      'sm:-mt-6',
      'w-auto',
    )
  })
})
