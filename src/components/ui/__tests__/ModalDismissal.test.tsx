import '@testing-library/jest-dom'
import { act, fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { Modal } from '../Modal'

function pendingAnimation() {
  let finish!: () => void
  const finished = new Promise<void>(resolve => { finish = resolve })
  return { finished, cancel: vi.fn(), finish }
}

describe('Modal dismissal lifecycle', () => {
  it('keeps the native dialog open during exit and dismisses once after closing', async () => {
    const onClose = vi.fn(() => { expect(dialog.open).toBe(false) })
    render(<Modal isOpen onClose={onClose} title="Details">Content</Modal>)
    const dialog = screen.getByRole('dialog') as HTMLDialogElement
    const animation = pendingAnimation()
    Object.defineProperty(dialog, 'animate', { value: vi.fn(() => animation) })
    const closeButton = screen.getByRole('button')
    fireEvent.click(closeButton)
    fireEvent.click(closeButton)
    expect(dialog.open).toBe(true)
    expect(onClose).not.toHaveBeenCalled()
    await act(async () => { animation.finish(); await animation.finished })
    expect(onClose).toHaveBeenCalledTimes(1)
    expect(animation.cancel).toHaveBeenCalledOnce()
    expect(dialog).not.toHaveAttribute('data-closing')
  })

  it('uses the current callback if the parent rerenders during an exit', async () => {
    const staleClose = vi.fn()
    const currentClose = vi.fn()
    const { rerender } = render(<Modal isOpen onClose={staleClose} title="Details">Content</Modal>)
    const dialog = screen.getByRole('dialog')
    const animation = pendingAnimation()
    Object.defineProperty(dialog, 'animate', { value: vi.fn(() => animation) })
    fireEvent.click(screen.getByRole('button'))
    rerender(<Modal isOpen onClose={currentClose} title="Details">Content</Modal>)
    await act(async () => { animation.finish(); await animation.finished })
    expect(staleClose).not.toHaveBeenCalled()
    expect(currentClose).toHaveBeenCalledOnce()
  })

  it('cancels an exit on unmount without firing a stale parent callback', async () => {
    const onClose = vi.fn()
    const { unmount } = render(<Modal isOpen onClose={onClose} title="Details">Content</Modal>)
    const dialog = screen.getByRole('dialog')
    const animation = pendingAnimation()
    Object.defineProperty(dialog, 'animate', { value: vi.fn(() => animation) })
    fireEvent.click(screen.getByRole('button'))
    unmount()
    await act(async () => { animation.finish(); await animation.finished })
    expect(animation.cancel).toHaveBeenCalledOnce()
    expect(onClose).not.toHaveBeenCalled()
  })
})
