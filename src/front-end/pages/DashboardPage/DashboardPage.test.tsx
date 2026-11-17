// @vitest-environment jsdom

import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import DashboardPage from './DashboardPage';

afterEach(cleanup);

describe('DashboardPage', () => {
  it('renders the dashboard with an explicit empty widget state', () => {
    // Arrange and act: render the dashboard before any widget is configured.
    render(<DashboardPage />);

    // Assert: the page remains accessible and explains its empty state.
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
        name: 'Aucun widget configuré',
      }),
    ).toBeTruthy();
    expect(
      screen.getByText(
        'Le tableau de bord est prêt à accueillir vos widgets de suivi des films.',
      ),
    ).toBeTruthy();
  });
});
