import { act, cleanup, fireEvent, render, screen, within } from '@testing-library/react'
import { afterEach, expect, it, vi } from 'vitest'
import AccessibilityPanel from './AccessibilityPanel'
import { AccessibilityProvider } from '../../contexts/AccessibilityContext'

afterEach(() => {
  cleanup()
  vi.useRealTimers()
  vi.unstubAllGlobals()
  localStorage.clear()
})

it('reads hovered text through the end and replaces it on the next text', () => {
  const speechSynthesis = { speak: vi.fn(), cancel: vi.fn() }
  vi.stubGlobal('speechSynthesis', speechSynthesis)
  vi.stubGlobal('SpeechSynthesisUtterance', class {
    constructor(text) { this.text = text }
  })
  vi.useFakeTimers()

  render(
    <>
      <main id="application-content"><p>Texto para leitura</p><p>Outro texto</p></main>
      <AccessibilityProvider><AccessibilityPanel /></AccessibilityProvider>
    </>,
  )

  fireEvent.click(screen.getByRole('button', { name: 'Abrir painel de acessibilidade' }))
  fireEvent.click(within(screen.getByRole('dialog')).getByRole('checkbox', { name: 'Ler ao passar o mouse' }))
  fireEvent.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Fechar painel de acessibilidade' }))

  const text = screen.getByText('Texto para leitura')
  fireEvent.mouseOver(text)
  act(() => vi.advanceTimersByTime(200))
  expect(speechSynthesis.speak).toHaveBeenCalledOnce()
  expect(speechSynthesis.speak.mock.calls[0][0].text).toBe('Texto para leitura')

  const cancellations = speechSynthesis.cancel.mock.calls.length
  fireEvent.mouseOut(text, { relatedTarget: document.body })
  expect(speechSynthesis.cancel.mock.calls.length).toBe(cancellations)

  fireEvent.mouseOver(screen.getByText('Outro texto'))
  act(() => vi.advanceTimersByTime(200))
  expect(speechSynthesis.cancel.mock.calls.length).toBeGreaterThan(cancellations)
  expect(speechSynthesis.speak.mock.calls[1][0].text).toBe('Outro texto')
})

it('shows a speech engine error after the test button is pressed', () => {
  const speechSynthesis = { speak: vi.fn(), cancel: vi.fn(), getVoices: () => [] }
  vi.stubGlobal('speechSynthesis', speechSynthesis)
  vi.stubGlobal('SpeechSynthesisUtterance', class {
    constructor(text) { this.text = text }
  })

  render(<AccessibilityProvider><AccessibilityPanel /></AccessibilityProvider>)
  fireEvent.click(screen.getByRole('button', { name: 'Abrir painel de acessibilidade' }))
  fireEvent.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Testar voz' }))
  const utterance = speechSynthesis.speak.mock.calls[0][0]
  act(() => utterance.onerror({ error: 'synthesis-unavailable' }))
  expect(screen.getByRole('status')).toHaveTextContent('não tem um mecanismo de leitura')
})

it('uses and saves the selected Portuguese voice', () => {
  const voice = { voiceURI: 'maria-pt', name: 'Maria', lang: 'pt-BR' }
  const speechSynthesis = { speak: vi.fn(), cancel: vi.fn(), getVoices: () => [voice] }
  vi.stubGlobal('speechSynthesis', speechSynthesis)
  vi.stubGlobal('SpeechSynthesisUtterance', class {
    constructor(text) { this.text = text }
  })

  render(<AccessibilityProvider><AccessibilityPanel /></AccessibilityProvider>)
  fireEvent.click(screen.getByRole('button', { name: 'Abrir painel de acessibilidade' }))
  fireEvent.change(screen.getByRole('combobox', { name: 'Voz' }), { target: { value: 'maria-pt' } })
  fireEvent.click(screen.getByRole('button', { name: 'Testar voz' }))

  expect(speechSynthesis.speak.mock.calls[0][0].voice).toBe(voice)
  expect(JSON.parse(localStorage.getItem('jobfinder-accessibility')).speechVoice).toBe('maria-pt')
})
