// @vitest-environment jsdom

import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import DashboardPage from './DashboardPage';

afterEach(cleanup);

describe('DashboardPage', () => {
  it('renders the dashboard with the best-rated genre widget', () => {
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
        name: 'Meilleure note',
      }),
    ).toBeTruthy();
    expect(
      screen.getByText('Les notes par genre ne sont pas encore connectées.'),
    ).toBeTruthy();
  });
});
