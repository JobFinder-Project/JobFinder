import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import CriarVagaModal from '../src/features/vagas/CriarVagaModal/CriarVagaModal.jsx';

describe('Integração: Regras de Upload no CriarVagaModal', () => {
  it('Deve renderizar erro visual ao selecionar arquivo de formato não permitido', async () => {
    const mockOnClose = vi.fn();
    const mockOnSuccess = vi.fn();
    
    render(<CriarVagaModal empresaId="123" onClose={mockOnClose} onSuccess={mockOnSuccess} />);

    // Busca o input escondido pelo label
    const fileInput = screen.getByLabelText(/Clique para selecionar uma imagem/i);
    
    // Cria um arquivo PDF simulado
    const arquivoInvalido = new File(['fake-pdf'], 'documento.pdf', { type: 'application/pdf' });
    
    // Dispara a seleção do arquivo
    await userEvent.upload(fileInput, arquivoInvalido);

    // Verifica se a mensagem exata de erro aparece na tela
    const mensagemErro = await screen.findByText(/Formato inválido. Apenas SVG, PNG ou JPG são permitidos./i);
    expect(mensagemErro).toBeInTheDocument();
  });

  it('Deve renderizar erro visual ao selecionar imagem maior que 10MB', async () => {
    render(<CriarVagaModal empresaId="123" onClose={vi.fn()} onSuccess={vi.fn()} />);

    const fileInput = screen.getByLabelText(/Clique para selecionar uma imagem/i);
    
    // Simula uma imagem JPG e injeta manualmente o tamanho de 11MB
    const imagemPesada = new File([''], 'imagem-alta-resolucao.jpg', { type: 'image/jpeg' });
    Object.defineProperty(imagemPesada, 'size', { value: 11 * 1024 * 1024 }); 
    
    await userEvent.upload(fileInput, imagemPesada);

    const mensagemErro = await screen.findByText(/A imagem excede o limite máximo de 10MB./i);
    expect(mensagemErro).toBeInTheDocument();
  });
});