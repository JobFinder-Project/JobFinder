import { describe, expect, it, vi } from 'vitest'
import { useState } from 'react'
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { axe } from 'jest-axe'
import Modal from '../ui/Modal/Modal'
import DashboardLayout from '../Layout/DashboardLayout/DashboardLayout'
import EscolherCargoModal from '../../features/auth/EscolherCargoModal/EscolherCargoModal'
import SignupPage from '../../pages/Signup/SignupPage'
import AccessibilityPanel from '../AccessibilityPanel/AccessibilityPanel'
import { AccessibilityProvider } from '../../contexts/AccessibilityContext'

vi.mock('../../contexts/AuthContext', () => ({ useAuth: () => ({ logout: vi.fn() }) }))

describe('interfaces acessíveis', () => {
  it('Modal mantém o foco e devolve ao acionador', async () => {
    function Host() {
      const [open, setOpen] = useState(false)
      return <><button onClick={() => setOpen(true)}>Abrir</button>{open && <Modal title="Teste" onClose={() => setOpen(false)}><button>Primeiro</button><button>Último</button></Modal>}</>
    }
    const { container } = render(<Host />)
    await userEvent.click(screen.getByRole('button', { name: 'Abrir' }))
    expect(screen.getByRole('button', { name: 'Fechar modal' })).toHaveFocus()
    fireEvent.keyDown(document, { key: 'Tab', shiftKey: true })
    expect(screen.getByRole('button', { name: 'Último' })).toHaveFocus()
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(screen.getByRole('button', { name: 'Abrir' })).toHaveFocus()
    expect(await axe(container)).toHaveNoViolations()
  })

  it('SignupPage associa campos e rótulos', async () => {
    const { container } = render(<MemoryRouter initialEntries={['/candidato/cadastrar']}><SignupPage /></MemoryRouter>)
    expect(screen.getByRole('textbox', { name: /Nome Completo/i })).toBeInTheDocument()
    expect(await axe(container)).toHaveNoViolations()
  })

  it('EscolherCargoModal tem opções por teclado', async () => {
    const { container } = render(<MemoryRouter><EscolherCargoModal onClose={vi.fn()} /></MemoryRouter>)
    await userEvent.click(screen.getByRole('button', { name: /Sou Candidato/i }))
    expect(screen.getByRole('button', { name: /Sou Candidato/i })).toHaveAttribute('aria-pressed', 'true')
    expect(await axe(container)).toHaveNoViolations()
  })

  it('DashboardLayout oferece landmark principal', async () => {
    const { container } = render(<MemoryRouter><DashboardLayout userType="candidate"><h1>Painel</h1></DashboardLayout></MemoryRouter>)
    expect(screen.getByRole('main')).toHaveAttribute('id', 'main-content')
    expect(await axe(container)).toHaveNoViolations()
  })

  it('painel mantém foco e fecha por Escape', async () => {
    const { container } = render(<AccessibilityProvider><AccessibilityPanel /></AccessibilityProvider>)
    await userEvent.click(screen.getByRole('button', { name: 'Abrir painel de acessibilidade' }))
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    await waitFor(() => expect(within(screen.getByRole('dialog')).getByRole('button', { name: 'Fechar painel de acessibilidade' })).toHaveFocus())
    expect(await axe(container)).toHaveNoViolations()
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Abrir painel de acessibilidade' })).toHaveFocus()
  })
})
