import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import ExcluirContaModal from '../ExcluirContaModal';

const renderModal = (props = {}) => {
  const onConfirm = props.onConfirm ?? vi.fn().mockResolvedValue(undefined);
  const onClose = props.onClose ?? vi.fn();

  render(<ExcluirContaModal tipo={props.tipo} onConfirm={onConfirm} onClose={onClose} />);

  return { onConfirm, onClose };
};

describe('ExcluirContaModal', () => {
  it('deve avisar que a exclusão é irreversível e só habilitar a confirmação com senha preenchida', async () => {
    const user = userEvent.setup();
    renderModal();

    expect(screen.getByText(/não pode ser desfeita/i)).toBeInTheDocument();

    const confirmar = screen.getByRole('button', { name: /excluir minha conta/i });
    expect(confirmar).toBeDisabled();

    await user.type(screen.getByLabelText(/confirme sua senha/i), 'senhaForte123');
    expect(confirmar).toBeEnabled();
  });

  it('deve descrever o que será removido conforme o tipo de conta', () => {
    renderModal({ tipo: 'empresa' });

    expect(screen.getByText(/vagas publicadas e as candidaturas recebidas/i)).toBeInTheDocument();
  });

  it('deve enviar a senha informada ao confirmar', async () => {
    const user = userEvent.setup();
    const { onConfirm } = renderModal();

    await user.type(screen.getByLabelText(/confirme sua senha/i), 'senhaForte123');
    await user.click(screen.getByRole('button', { name: /excluir minha conta/i }));

    expect(onConfirm).toHaveBeenCalledWith('senhaForte123');
  });

  it('deve exibir a mensagem da API quando a senha estiver incorreta e manter o modal aberto', async () => {
    const user = userEvent.setup();
    const erro = Object.assign(new Error('Erro na requisição'), {
      status: 400,
      data: { message: 'Senha incorreta.', status: 400 },
    });
    const { onClose } = renderModal({ onConfirm: vi.fn().mockRejectedValue(erro) });

    await user.type(screen.getByLabelText(/confirme sua senha/i), 'senhaerrada');
    await user.click(screen.getByRole('button', { name: /excluir minha conta/i }));

    expect(await screen.findByRole('alert')).toHaveTextContent('Senha incorreta.');
    await waitFor(() =>
      expect(screen.getByRole('button', { name: /excluir minha conta/i })).toBeEnabled()
    );
    expect(onClose).not.toHaveBeenCalled();
  });

  it('deve fechar ao cancelar sem confirmar a exclusão', async () => {
    const user = userEvent.setup();
    const { onConfirm, onClose } = renderModal();

    await user.click(screen.getByRole('button', { name: /cancelar/i }));

    expect(onClose).toHaveBeenCalled();
    expect(onConfirm).not.toHaveBeenCalled();
  });
});
