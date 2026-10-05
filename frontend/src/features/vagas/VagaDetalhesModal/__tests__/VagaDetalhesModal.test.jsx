import { expect, it, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import VagaDetalhesModal from '../VagaDetalhesModal'
import { candidatoService } from '../../../../services/candidatoService'

vi.mock('../../../../services/candidatoService', () => ({
  candidatoService: { cancelarCandidatura: vi.fn() },
}))

it('confirma o cancelamento em diálogo antes de alterar a candidatura', async () => {
  candidatoService.cancelarCandidatura.mockResolvedValue({})
  render(<VagaDetalhesModal vaga={{ _id: 'vaga-1', nome: 'Analista' }} candidatura={{ _id: 'cand-1', status: 'Pendente' }} onClose={vi.fn()} />)

  await userEvent.click(screen.getByRole('button', { name: 'Cancelar Candidatura' }))
  expect(screen.getByRole('dialog', { name: 'Confirmar cancelamento' })).toBeInTheDocument()
  expect(candidatoService.cancelarCandidatura).not.toHaveBeenCalled()

  await userEvent.click(screen.getByRole('button', { name: 'Sim, cancelar' }))
  await waitFor(() => expect(candidatoService.cancelarCandidatura).toHaveBeenCalledWith('cand-1'))
  expect(screen.queryByRole('dialog', { name: 'Confirmar cancelamento' })).not.toBeInTheDocument()
})
