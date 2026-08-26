import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import GuestRoute from '../GuestRoute/GuestRoute';
import ProtectedRoute from '../ProtectedRoute/ProtectedRoute';
import { useAuth } from '../../contexts/AuthContext';

vi.mock('../../contexts/AuthContext', () => ({
  useAuth: vi.fn(),
}));

function LocationProbe() {
  const location = useLocation();
  return <span data-testid="location">{location.pathname}</span>;
}

function renderWithRoutes(element, initialEntry = '/privada') {
  return render(
    <MemoryRouter
      initialEntries={[initialEntry]}
      future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
    >
      <Routes>
        <Route path="/login" element={<LocationProbe />} />
        <Route path="/candidato/dashboard" element={<LocationProbe />} />
        <Route path="/empresa/dashboard" element={<LocationProbe />} />
        <Route
          path="/privada"
          element={
            <>
              {element}
              <LocationProbe />
            </>
          }
        />
      </Routes>
    </MemoryRouter>
  );
}

beforeEach(() => {
  useAuth.mockReset();
});

describe('ProtectedRoute', () => {
  it('deve exibir loading enquanto a sessão está carregando', () => {
    useAuth.mockReturnValue({ loading: true, isAuthenticated: false, user: null });

    renderWithRoutes(
      <ProtectedRoute allowedRole="candidato">
        <div>Conteúdo protegido</div>
      </ProtectedRoute>
    );

    expect(screen.getByTestId('loading-indicator')).toBeInTheDocument();
  });

  it('deve redirecionar usuário anônimo para login', () => {
    useAuth.mockReturnValue({ loading: false, isAuthenticated: false, user: null });

    renderWithRoutes(
      <ProtectedRoute allowedRole="candidato">
        <div>Conteúdo protegido</div>
      </ProtectedRoute>
    );

    expect(screen.getByTestId('location')).toHaveTextContent('/login');
  });

  it('deve renderizar conteúdo quando usuário tiver o perfil permitido', () => {
    useAuth.mockReturnValue({
      loading: false,
      isAuthenticated: true,
      user: { role: 'candidato' },
    });

    renderWithRoutes(
      <ProtectedRoute allowedRole="candidato">
        <div>Conteúdo protegido</div>
      </ProtectedRoute>
    );

    expect(screen.getByText('Conteúdo protegido')).toBeInTheDocument();
    expect(screen.getByTestId('location')).toHaveTextContent('/privada');
  });

  it('deve redirecionar usuário autenticado para o dashboard correto quando o perfil divergir', () => {
    useAuth.mockReturnValue({
      loading: false,
      isAuthenticated: true,
      user: { role: 'empresa' },
    });

    renderWithRoutes(
      <ProtectedRoute allowedRole="candidato">
        <div>Conteúdo protegido</div>
      </ProtectedRoute>
    );

    expect(screen.getByTestId('location')).toHaveTextContent('/empresa/dashboard');
  });
});

describe('GuestRoute', () => {
  it('deve renderizar conteúdo público para usuário anônimo', () => {
    useAuth.mockReturnValue({ loading: false, isAuthenticated: false, user: null });

    renderWithRoutes(
      <GuestRoute>
        <div>Login público</div>
      </GuestRoute>
    );

    expect(screen.getByText('Login público')).toBeInTheDocument();
  });

  it('deve redirecionar candidato autenticado para o dashboard de candidato', () => {
    useAuth.mockReturnValue({
      loading: false,
      isAuthenticated: true,
      user: { role: 'candidato' },
    });

    renderWithRoutes(
      <GuestRoute>
        <div>Login público</div>
      </GuestRoute>
    );

    expect(screen.getByTestId('location')).toHaveTextContent('/candidato/dashboard');
  });

  it('deve redirecionar empresa autenticada para o dashboard de empresa', () => {
    useAuth.mockReturnValue({
      loading: false,
      isAuthenticated: true,
      user: { role: 'empresa' },
    });

    renderWithRoutes(
      <GuestRoute>
        <div>Login público</div>
      </GuestRoute>
    );

    expect(screen.getByTestId('location')).toHaveTextContent('/empresa/dashboard');
  });
});
