import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { Modal } from '../Modal'

describe('Modal', () => {
  it('uses the unified publication-modal width', () => {
    render(
      <Modal
        isOpen
        onClose={vi.fn()}
        title="Modal title"
      >
        Modal content
      </Modal>,
    )

    expect(screen.getByRole('dialog')).toHaveClass(
      'w-[min(calc(100vw-2rem),64rem)]'
    )
  })
})
