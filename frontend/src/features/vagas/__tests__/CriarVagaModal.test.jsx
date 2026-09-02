import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import CriarVagaModal from '../CriarVagaModal.jsx';
import { empresaService } from '../../../../services/empresaService.js';

vi.mock('../../../../services/empresaService.js', () => ({
  empresaService: {
    criarVaga: vi.fn(),
  },
}));

const renderModal = () =>
  render(<CriarVagaModal empresaId="empresa-1" onClose={vi.fn()} onSuccess={vi.fn()} />);

const invalidNonImageFiles = [
  new File(['fake-pdf'], 'documento.pdf', { type: 'application/pdf' }),
  new File(['fake-mp4'], 'video.mp4', { type: 'video/mp4' }),
  new File(['fake-mov'], 'video.mov', { type: 'video/quicktime' }),
  new File(['fake-zip'], 'arquivo.zip', { type: 'application/zip' }),
  new File(['fake-text'], 'observacoes.txt', { type: 'text/plain' }),
  new File(['fake-json'], 'payload.json', { type: 'application/json' }),
];

const validImageFiles = [
  new File(['fake-svg'], 'banner.svg', { type: 'image/svg+xml' }),
  new File(['fake-png'], 'banner.png', { type: 'image/png' }),
  new File(['fake-jpg'], 'banner.jpg', { type: 'image/jpeg' }),
  new File(['fake-jpeg'], 'banner.jpeg', { type: 'image/jpeg' }),
];

describe('CriarVagaModal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it.each(invalidNonImageFiles)(
    'deve bloquear arquivo que não seja imagem: %s',
    async (arquivoInvalido) => {
      const user = userEvent.setup({ applyAccept: false });
      renderModal();

      const fileInput = screen.getByLabelText(/Clique para selecionar uma imagem/i);

      await user.upload(fileInput, arquivoInvalido);

      expect(
        await screen.findByText(/Formato inválido. Apenas SVG, PNG ou JPG são permitidos./i)
      ).toBeInTheDocument();
      expect(fileInput.files).toHaveLength(0);
    }
  );

  it('deve bloquear GIF mesmo sendo um tipo de imagem', async () => {
    const user = userEvent.setup({ applyAccept: false });
    renderModal();

    const fileInput = screen.getByLabelText(/Clique para selecionar uma imagem/i);
    const gif = new File(['fake-gif'], 'banner.gif', {
      type: 'image/gif',
    });

    await user.upload(fileInput, gif);

    expect(
      await screen.findByText(/Formato inválido. Apenas SVG, PNG ou JPG são permitidos./i)
    ).toBeInTheDocument();
    expect(fileInput.files).toHaveLength(0);
  });

  it('deve bloquear arquivo com extensão não permitida mesmo se o MIME for de imagem', async () => {
    const user = userEvent.setup({ applyAccept: false });
    renderModal();

    const fileInput = screen.getByLabelText(/Clique para selecionar uma imagem/i);
    const arquivoDisfarcado = new File(['fake-png'], 'documento.pdf', {
      type: 'image/png',
    });

    await user.upload(fileInput, arquivoDisfarcado);

    expect(
      await screen.findByText(/Formato inválido. Apenas SVG, PNG ou JPG são permitidos./i)
    ).toBeInTheDocument();
    expect(fileInput.files).toHaveLength(0);
  });

  it('deve bloquear arquivo com extensão permitida quando o MIME não for de imagem', async () => {
    const user = userEvent.setup({ applyAccept: false });
    renderModal();

    const fileInput = screen.getByLabelText(/Clique para selecionar uma imagem/i);
    const arquivoDisfarcado = new File(['fake-pdf'], 'banner.png', {
      type: 'application/pdf',
    });

    await user.upload(fileInput, arquivoDisfarcado);

    expect(
      await screen.findByText(/Formato inválido. Apenas SVG, PNG ou JPG são permitidos./i)
    ).toBeInTheDocument();
    expect(fileInput.files).toHaveLength(0);
  });

  it('deve bloquear imagem maior que 10MB', async () => {
    renderModal();

    const fileInput = screen.getByLabelText(/Clique para selecionar uma imagem/i);
    const imagemPesada = new File([''], 'imagem-alta-resolucao.jpg', {
      type: 'image/jpeg',
    });
    Object.defineProperty(imagemPesada, 'size', { value: 11 * 1024 * 1024 });

    await userEvent.upload(fileInput, imagemPesada);

    expect(
      await screen.findByText(/A imagem excede o limite máximo de 10MB./i)
    ).toBeInTheDocument();
    expect(fileInput.files).toHaveLength(0);
  });

  it('deve limpar imagem válida anterior ao selecionar arquivo inválido', async () => {
    const user = userEvent.setup({ applyAccept: false });
    empresaService.criarVaga.mockResolvedValue({
      success: true,
      vaga: { _id: 'vaga-1', nome: 'Analista Administrativo' },
    });

    renderModal();

    await user.type(screen.getByLabelText(/Título da Vaga/i), 'Analista Administrativo');
    await user.selectOptions(screen.getByLabelText(/Área \/ Categoria/i), 'Administrativa');
    await user.type(
      screen.getByLabelText(/Requisitos Exigidos/i),
      'Experiência com rotinas administrativas'
    );

    const fileInput = screen.getByLabelText(/Clique para selecionar uma imagem/i);
    const imagemValida = validImageFiles.find((file) => file.name === 'banner.png');
    const arquivoInvalido = new File(['fake-pdf'], 'documento.pdf', {
      type: 'application/pdf',
    });

    await user.upload(fileInput, imagemValida);
    await user.upload(fileInput, arquivoInvalido);
    await user.click(screen.getByRole('button', { name: /Publicar Vaga/i }));

    const formData = empresaService.criarVaga.mock.calls[0][0];
    expect(formData.has('imagem')).toBe(false);
  });

  it.each(validImageFiles)('deve aceitar imagem válida: %s', async (imagemValida) => {
    const user = userEvent.setup();
    const onSuccess = vi.fn();
    empresaService.criarVaga.mockResolvedValue({
      success: true,
      vaga: { _id: 'vaga-1', nome: 'Analista Administrativo' },
    });

    render(<CriarVagaModal empresaId="empresa-1" onClose={vi.fn()} onSuccess={onSuccess} />);

    await user.type(screen.getByLabelText(/Título da Vaga/i), 'Analista Administrativo');
    await user.selectOptions(screen.getByLabelText(/Área \/ Categoria/i), 'Administrativa');
    await user.type(
      screen.getByLabelText(/Requisitos Exigidos/i),
      'Experiência com rotinas administrativas'
    );

    const fileInput = screen.getByLabelText(/Clique para selecionar uma imagem/i);

    await user.upload(fileInput, imagemValida);
    await user.click(screen.getByRole('button', { name: /Publicar Vaga/i }));

    expect(empresaService.criarVaga).toHaveBeenCalledTimes(1);
    const formData = empresaService.criarVaga.mock.calls[0][0];
    expect(formData.get('imagem')).toBe(imagemValida);
    expect(onSuccess).toHaveBeenCalledWith({ _id: 'vaga-1', nome: 'Analista Administrativo' });
  });
});
