// @vitest-environment jsdom

import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import DashboardPage from './DashboardPage';

afterEach(cleanup);

describe('DashboardPage', () => {
  it('renders the dashboard with the average rating widget', () => {
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
      screen.getByRole('heading', { level: 2, name: 'Note moyenne' }),
    ).toBeTruthy();
    expect(
      screen.getByText("Aucune note n'est disponible dans le catalogue."),
    ).toBeTruthy();
  });
});
