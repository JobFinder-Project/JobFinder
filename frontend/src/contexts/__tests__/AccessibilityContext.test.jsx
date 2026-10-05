import { beforeEach, describe, expect, it } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ACCESSIBILITY_STORAGE_KEY, AccessibilityProvider, useAccessibility } from '../AccessibilityContext'

function Probe() {
  const { preferences, setPreference, resetAll } = useAccessibility()
  return <>
    <output data-testid="size">{preferences.textSize}</output>
    <output data-testid="contrast">{String(preferences.highContrast)}</output>
    <button onClick={() => setPreference('textSize', 'large')}>Aumentar</button>
    <button onClick={() => setPreference('highContrast', true)}>Contraste</button>
    <button onClick={resetAll}>Resetar</button>
  </>
}

beforeEach(() => localStorage.clear())

describe('AccessibilityContext', () => {
  it('carrega preferências salvas e aplica os atributos na raiz', async () => {
    localStorage.setItem(ACCESSIBILITY_STORAGE_KEY, JSON.stringify({ textSize: 'extraLarge', highContrast: true }))
    render(<AccessibilityProvider><Probe /></AccessibilityProvider>)
    expect(screen.getByTestId('size')).toHaveTextContent('extraLarge')
    expect(screen.getByTestId('contrast')).toHaveTextContent('true')
    expect(document.documentElement.style.getPropertyValue('--a11y-font-size')).toBe('21px')
    expect(document.documentElement.dataset.a11yContrast).toBe('true')
  })

  it('persiste mudanças', async () => {
    render(<AccessibilityProvider><Probe /></AccessibilityProvider>)
    await userEvent.click(screen.getByRole('button', { name: 'Aumentar' }))
    await waitFor(() => expect(JSON.parse(localStorage.getItem(ACCESSIBILITY_STORAGE_KEY)).textSize).toBe('large'))
  })

  it('resetAll restaura os padrões e limpa o localStorage', async () => {
    render(<AccessibilityProvider><Probe /></AccessibilityProvider>)
    await userEvent.click(screen.getByRole('button', { name: 'Contraste' }))
    await userEvent.click(screen.getByRole('button', { name: 'Resetar' }))
    expect(screen.getByTestId('contrast')).toHaveTextContent('false')
    await waitFor(() => expect(localStorage.getItem(ACCESSIBILITY_STORAGE_KEY)).toBeNull())
  })
})
