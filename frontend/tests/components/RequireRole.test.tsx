import { render, screen } from '@testing-library/react';
import { RequireRole } from '@/components/auth/RequireRole';

jest.mock('@/stores/auth-store', () => ({
  useAuthStore: (selector: (s: unknown) => unknown) =>
    selector({
      user: { id: '1', email: 'rh@test.com', name: 'RH', role: 'RH' },
    }),
}));

describe('RequireRole', () => {
  it('renders children when user has required role', () => {
    render(
      <RequireRole roles={['RH']}>
        <span>Contenu protégé</span>
      </RequireRole>
    );
    expect(screen.getByText('Contenu protégé')).toBeInTheDocument();
  });

  it('shows access denied when user role is not in allowed list', () => {
    render(
      <RequireRole roles={['ADMIN_RH']}>
        <span>Contenu admin</span>
      </RequireRole>
    );
    expect(screen.getByText(/Accès refusé/)).toBeInTheDocument();
  });
});
