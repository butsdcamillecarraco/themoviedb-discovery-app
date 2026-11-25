// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import MostProfitableMovieWidget from './MostProfitableMovieWidget';

afterEach(cleanup);

const movie = {
  title: 'The Shawshank Redemption',
  releaseYear: 1994,
  roiPercentage: 69667.36,
  posterUrl: 'https://example.com/poster.jpg',
};

describe('MostProfitableMovieWidget', () => {
  it('renders the provided title, year, ROI label, and percentage', () => {
    // Arrange and act
    render(<MostProfitableMovieWidget state="success" movie={movie} />);

    // Assert
    const widget = screen.getByRole('article', {
      name: 'Film le plus rentable',
    });
    expect(screen.getByRole('heading', { name: movie.title })).toBeTruthy();
    expect(screen.getByText('1994')).toBeTruthy();
    expect(screen.getByText('ROI')).toBeTruthy();
    expect(widget.textContent?.replace(/\u202f/g, ' ')).toContain(
      '69 667,36 %',
    );
  });

  it('renders an explicit accessible fallback for a missing poster', () => {
    // Arrange and act
    render(
      <MostProfitableMovieWidget
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
    render(<MostProfitableMovieWidget state="success" movie={movie} />);
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

  it('distinguishes an unknown ROI from a zero ROI', () => {
    // Arrange and act
    const { rerender } = render(
      <MostProfitableMovieWidget
        state="success"
        movie={{ ...movie, roiPercentage: null }}
      />,
    );

    // Assert: missing data is not displayed as zero.
    expect(screen.getByText('Indisponible')).toBeTruthy();
    expect(screen.queryByText('0,00 %')).toBeNull();

    // Act: zero is rendered only when it is the provided value.
    rerender(
      <MostProfitableMovieWidget
        state="success"
        movie={{ ...movie, roiPercentage: 0 }}
      />,
    );

    // Assert
    expect(screen.getByText('0,00 %')).toBeTruthy();
  });

  it('renders an unknown year', () => {
    // Arrange and act
    render(
      <MostProfitableMovieWidget
        state="success"
        movie={{ ...movie, releaseYear: null }}
      />,
    );

    // Assert
    expect(screen.getByText('Inconnue')).toBeTruthy();
  });

  it('renders an empty state when no eligible movie is provided', () => {
    // Arrange and act
    render(<MostProfitableMovieWidget state="empty" />);

    // Assert
    expect(
      screen.getByText("Aucun film éligible n'est disponible."),
    ).toBeTruthy();
  });

  it('explains that ROI data are unavailable until eligibility rules are validated', () => {
    // Arrange and act
    render(<MostProfitableMovieWidget state="unavailable" />);

    // Assert
    expect(
      screen.getByText(
        "Règles d'éligibilité des budgets et recettes à valider avant de connecter le catalogue.",
      ),
    ).toBeTruthy();
  });

  it('renders a loading message', () => {
    // Arrange and act
    render(<MostProfitableMovieWidget state="loading" />);

    // Assert
    expect(screen.getByRole('status').textContent).toBe(
      'Chargement du film le plus rentable...',
    );
  });

  it('renders the default error message as an alert', () => {
    // Arrange and act
    render(<MostProfitableMovieWidget state="error" />);

    // Assert
    expect(screen.getByRole('alert').textContent).toBe(
      'Impossible de charger le film le plus rentable.',
    );
  });

  it('renders a provided error message', () => {
    // Arrange and act
    render(
      <MostProfitableMovieWidget
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
