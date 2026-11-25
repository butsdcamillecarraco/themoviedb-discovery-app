// @vitest-environment jsdom

import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import AverageDurationWidget from './AverageDurationWidget';

afterEach(cleanup);

describe('AverageDurationWidget', () => {
  it('renders the provided average with its minute unit', () => {
    // Arrange and act
    render(<AverageDurationWidget state="success" averageMinutes={107} />);

    // Assert
    expect(screen.getByRole('heading', { name: 'Durée moyenne' })).toBeTruthy();
    expect(screen.getByText('107')).toBeTruthy();
    expect(screen.getByText('min')).toBeTruthy();
  });

  it('renders a loading message', () => {
    // Arrange and act
    render(<AverageDurationWidget state="loading" />);

    // Assert
    expect(screen.getByRole('status').textContent).toBe(
      'Calcul de la durée moyenne...',
    );
  });

  it('shows that the average is unavailable when there are no valid durations', () => {
    // Arrange and act
    render(<AverageDurationWidget state="empty" />);

    // Assert
    expect(
      screen.getByText("Aucune durée valide n'est disponible."),
    ).toBeTruthy();
    expect(screen.queryByText('0')).toBeNull();
  });

  it('renders the error message as an alert', () => {
    // Arrange and act
    render(
      <AverageDurationWidget
        state="error"
        message="Le calcul de la durée a échoué."
      />,
    );

    // Assert
    expect(screen.getByRole('alert').textContent).toBe(
      'Le calcul de la durée a échoué.',
    );
  });
});
