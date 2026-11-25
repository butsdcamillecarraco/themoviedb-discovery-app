// @vitest-environment jsdom

import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import DashboardPage from './DashboardPage';

afterEach(cleanup);

describe('DashboardPage', () => {
  it('renders the dashboard with the most profitable movie widget', () => {
    // Arrange and act
    render(<DashboardPage />);

    // Assert
    expect(screen.getByRole('main')).toBeTruthy();
    expect(
      screen.getByRole('heading', {
        level: 1,
        name: 'Tableau de bord des films',
      }),
    ).toBeTruthy();
    expect(
      screen.getByRole('heading', {
        level: 2,
        name: 'Film le plus rentable',
      }),
    ).toBeTruthy();
    expect(
      screen.getByText(
        "Règles d'éligibilité des budgets et recettes à valider avant de connecter le catalogue.",
      ),
    ).toBeTruthy();
  });
});
