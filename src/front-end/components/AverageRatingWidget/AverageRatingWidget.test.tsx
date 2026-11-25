// @vitest-environment jsdom

import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import AverageRatingWidget from './AverageRatingWidget';

afterEach(cleanup);

describe('AverageRatingWidget', () => {
  it('renders the simple catalogue average with French decimals and its scale', () => {
    // Arrange and act
    render(<AverageRatingWidget state="success" averageRating={6.78} />);

    // Assert
    expect(screen.getByRole('heading', { name: 'Note moyenne' })).toBeTruthy();
    expect(screen.getByText('6,78')).toBeTruthy();
    expect(screen.getByText('/ 10')).toBeTruthy();
    expect(
      screen.getByText('Moyenne simple du catalogue (non pondérée)'),
    ).toBeTruthy();
  });

  it('always displays two decimal places', () => {
    // Arrange and act
    render(<AverageRatingWidget state="success" averageRating={6.7} />);

    // Assert
    expect(screen.getByText('6,70')).toBeTruthy();
  });

  it('renders a loading message', () => {
    // Arrange and act
    render(<AverageRatingWidget state="loading" />);

    // Assert
    expect(screen.getByRole('status').textContent).toBe(
      'Chargement de la note moyenne...',
    );
  });

  it('distinguishes a missing score from a score of zero', () => {
    // Arrange and act
    const { rerender } = render(<AverageRatingWidget state="empty" />);

    // Assert: missing notes are described instead of being displayed as zero.
    expect(
      screen.getByText("Aucune note n'est disponible dans le catalogue."),
    ).toBeTruthy();
    expect(screen.queryByText('0,00')).toBeNull();

    // Act: zero remains a valid value when it is explicitly provided.
    rerender(<AverageRatingWidget state="success" averageRating={0} />);

    // Assert
    expect(screen.getByText('0,00')).toBeTruthy();
    expect(screen.getByText('/ 10')).toBeTruthy();
  });

  it('renders the error message as an alert', () => {
    // Arrange and act
    render(<AverageRatingWidget state="error" />);

    // Assert
    expect(screen.getByRole('alert').textContent).toBe(
      'Impossible de charger la note moyenne.',
    );
  });

  it('renders a provided error message', () => {
    // Arrange and act
    render(
      <AverageRatingWidget
        state="error"
        message="Le catalogue est indisponible."
      />,
    );

    // Assert
    expect(screen.getByRole('alert').textContent).toBe(
      'Le catalogue est indisponible.',
    );
  });
});
