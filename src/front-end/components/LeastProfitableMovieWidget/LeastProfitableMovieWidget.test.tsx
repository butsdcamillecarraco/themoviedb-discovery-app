// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import LeastProfitableMovieWidget from './LeastProfitableMovieWidget';

afterEach(cleanup);

const movie = {
  title: 'Example Movie',
  releaseYear: 2020,
  roiPercentage: -100,
  posterUrl: 'https://example.com/poster.jpg',
};

describe('LeastProfitableMovieWidget', () => {
  it('renders the provided movie details and preserves the negative ROI', () => {
    // Arrange and act
    render(<LeastProfitableMovieWidget state="success" movie={movie} />);

    // Assert
    expect(
      screen.getByRole('heading', { name: 'Film le moins rentable' }),
    ).toBeTruthy();
    expect(screen.getByRole('heading', { name: movie.title })).toBeTruthy();
    expect(screen.getByText('2020')).toBeTruthy();
    expect(screen.getByText('ROI')).toBeTruthy();
    expect(screen.getByText('-100,00 %')).toBeTruthy();
  });

  it('distinguishes a valid zero ROI from an unknown ROI', () => {
    // Arrange
    const { rerender } = render(
      <LeastProfitableMovieWidget
        state="success"
        movie={{ ...movie, roiPercentage: 0 }}
      />,
    );

    // Assert: an explicitly provided zero is rendered as a percentage.
    expect(screen.getByText('0,00 %')).toBeTruthy();

    // Act
    rerender(
      <LeastProfitableMovieWidget
        state="success"
        movie={{ ...movie, roiPercentage: null }}
      />,
    );

    // Assert: missing data is not converted to zero.
    expect(screen.getByText('Indisponible')).toBeTruthy();
    expect(screen.queryByText('0,00 %')).toBeNull();
  });

  it('renders an explicit accessible fallback for a missing poster', () => {
    // Arrange and act
    render(
      <LeastProfitableMovieWidget
        state="success"
        movie={{ ...movie, posterUrl: null }}
      />,
    );

    // Assert
    expect(
      screen.getByRole('img', {
        name: `Affiche indisponible pour ${movie.title}`,
      }),
    ).toBeTruthy();
    expect(screen.getByText('Affiche indisponible')).toBeTruthy();
  });

  it('renders a fallback when the poster fails to load', () => {
    // Arrange
    render(<LeastProfitableMovieWidget state="success" movie={movie} />);
    const poster = screen.getByRole('img', {
      name: `Affiche de ${movie.title}`,
    });

    // Act
    fireEvent.error(poster);

    // Assert
    expect(
      screen.getByRole('img', {
        name: `Affiche indisponible pour ${movie.title}`,
      }),
    ).toBeTruthy();
  });

  it('renders an unknown year', () => {
    // Arrange and act
    render(
      <LeastProfitableMovieWidget
        state="success"
        movie={{ ...movie, releaseYear: null }}
      />,
    );

    // Assert
    expect(screen.getByText('Inconnue')).toBeTruthy();
  });

  it('renders an empty state when no eligible movie exists', () => {
    // Arrange and act
    render(<LeastProfitableMovieWidget state="empty" />);

    // Assert
    expect(
      screen.getByText("Aucun film éligible n'est disponible."),
    ).toBeTruthy();
  });

  it('explains that real data are unavailable until eligibility rules are validated', () => {
    // Arrange and act
    render(<LeastProfitableMovieWidget state="unavailable" />);

    // Assert
    expect(
      screen.getByText(
        "Règles d'éligibilité des budgets et recettes à valider avant de connecter le catalogue.",
      ),
    ).toBeTruthy();
  });

  it('renders a loading message', () => {
    // Arrange and act
    render(<LeastProfitableMovieWidget state="loading" />);

    // Assert
    expect(screen.getByRole('status').textContent).toBe(
      'Chargement du film le moins rentable...',
    );
  });

  it('renders the default error message as an alert', () => {
    // Arrange and act
    render(<LeastProfitableMovieWidget state="error" />);

    // Assert
    expect(screen.getByRole('alert').textContent).toBe(
      'Impossible de charger le film le moins rentable.',
    );
  });

  it('renders a provided error message', () => {
    // Arrange and act
    render(
      <LeastProfitableMovieWidget
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
