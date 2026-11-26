// @vitest-environment jsdom

import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import BestRatedGenreWidget from './BestRatedGenreWidget';

afterEach(cleanup);

describe('BestRatedGenreWidget', () => {
  it('renders the provided genre and its French-formatted simple average', () => {
    // Arrange and act
    render(
      <BestRatedGenreWidget
        state="success"
        genreName="Animation"
        averageRating={7.41}
      />,
    );

    // Assert
    expect(
      screen.getByRole('heading', { name: 'Meilleure note' }),
    ).toBeTruthy();
    expect(screen.getByText('Animation')).toBeTruthy();
    expect(screen.getByText('7,41')).toBeTruthy();
    expect(screen.getByText('/ 10')).toBeTruthy();
    expect(screen.getByText('Moyenne simple (non pondérée)')).toBeTruthy();
  });

  it('always formats the average with two decimal places', () => {
    // Arrange and act
    render(
      <BestRatedGenreWidget
        state="success"
        genreName="Animation"
        averageRating={7.4}
      />,
    );

    // Assert
    expect(screen.getByText('7,40')).toBeTruthy();
  });

  it('shows no valid rating instead of displaying zero', () => {
    // Arrange and act
    render(<BestRatedGenreWidget state="empty" />);

    // Assert
    expect(
      screen.getByText("Aucune note valide n'est disponible pour les genres."),
    ).toBeTruthy();
    expect(screen.queryByText('0,00')).toBeNull();
  });

  it('renders a long genre name without truncating it', () => {
    // Arrange and act
    render(
      <BestRatedGenreWidget
        state="success"
        genreName="Science-fiction et aventures spatiales"
        averageRating={7.41}
      />,
    );

    // Assert
    expect(
      screen.getByText('Science-fiction et aventures spatiales'),
    ).toBeTruthy();
  });

  it('renders a loading message', () => {
    // Arrange and act
    render(<BestRatedGenreWidget state="loading" />);

    // Assert
    expect(screen.getByRole('status').textContent).toBe(
      'Chargement de la meilleure note par genre...',
    );
  });

  it('renders the default error message as an alert', () => {
    // Arrange and act
    render(<BestRatedGenreWidget state="error" />);

    // Assert
    expect(screen.getByRole('alert').textContent).toBe(
      'Impossible de charger la meilleure note par genre.',
    );
  });

  it('renders a provided error message', () => {
    // Arrange and act
    render(
      <BestRatedGenreWidget
        state="error"
        message="Le catalogue est indisponible."
      />,
    );

    // Assert
    expect(screen.getByRole('alert').textContent).toBe(
      'Le catalogue est indisponible.',
    );
  });

  it('explains when genre ratings are not connected', () => {
    // Arrange and act
    render(<BestRatedGenreWidget state="unavailable" />);

    // Assert
    expect(
      screen.getByText('Les notes par genre ne sont pas encore connectées.'),
    ).toBeTruthy();
  });
});
