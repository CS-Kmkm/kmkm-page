import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { Modal } from '../Modal'

describe('Modal', () => {
  it('gives simultaneous dialogs distinct heading and description references', () => {
    render(<>
      <Modal isOpen onClose={vi.fn()} title="First" description="First description">Content</Modal>
      <Modal isOpen onClose={vi.fn()} title="Second" description="Second description">Content</Modal>
    </>)
    const dialogs = screen.getAllByRole('dialog', { hidden: true })
    const ids = dialogs.map(dialog => dialog.getAttribute('aria-labelledby'))
    expect(new Set(ids).size).toBe(2)
    dialogs.forEach(dialog => {
      expect(document.getElementById(dialog.getAttribute('aria-labelledby')!)).toBeTruthy()
      expect(document.getElementById(dialog.getAttribute('aria-describedby')!)).toBeTruthy()
    })
  })
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
