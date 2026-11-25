// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import BestRatedMovieWidget from './BestRatedMovieWidget';

afterEach(cleanup);

const movie = {
  title: 'The Shawshank Redemption',
  releaseYear: 1994,
  rating: 9.1,
  posterUrl: 'https://example.com/poster.jpg',
};

describe('BestRatedMovieWidget', () => {
  it('renders the provided poster, title, year, and localized rating', () => {
    // Arrange and act
    render(<BestRatedMovieWidget state="success" movie={movie} />);

    // Assert
    expect(
      screen.getByRole('heading', { name: 'Film le mieux noté' }),
    ).toBeTruthy();
    expect(
      screen
        .getByRole('img', { name: `Affiche de ${movie.title}` })
        .getAttribute('src'),
    ).toBe(movie.posterUrl);
    expect(screen.getByRole('heading', { name: movie.title })).toBeTruthy();
    expect(screen.getByText('1994')).toBeTruthy();
    expect(screen.getByText('9,1')).toBeTruthy();
    expect(screen.getByText('/ 10')).toBeTruthy();
  });

  it('shows an explicit accessible fallback when the poster is missing', () => {
    // Arrange and act
    render(
      <BestRatedMovieWidget
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

  it('shows the poster fallback when the image cannot be loaded', () => {
    // Arrange
    render(<BestRatedMovieWidget state="success" movie={movie} />);
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

  it('renders an unknown year and keeps a long title intact', () => {
    // Arrange
    const longTitle =
      'A Very Long Demonstration Movie Title That Must Remain Readable on Small Screens';

    // Act
    render(
      <BestRatedMovieWidget
        state="success"
        movie={{ ...movie, title: longTitle, releaseYear: null }}
      />,
    );

    // Assert
    expect(screen.getByRole('heading', { name: longTitle })).toBeTruthy();
    expect(screen.getByText('Inconnue')).toBeTruthy();
  });

  it('renders a loading message', () => {
    // Arrange and act
    render(<BestRatedMovieWidget state="loading" />);

    // Assert
    expect(screen.getByRole('status').textContent).toBe(
      'Chargement du film le mieux noté...',
    );
  });

  it('renders an empty state when no movie has a rating', () => {
    // Arrange and act
    render(<BestRatedMovieWidget state="empty" />);

    // Assert
    expect(screen.getByText("Aucun film noté n'est disponible.")).toBeTruthy();
  });

  it('renders the error message as an alert', () => {
    // Arrange and act
    render(<BestRatedMovieWidget state="error" />);

    // Assert
    expect(screen.getByRole('alert').textContent).toBe(
      'Impossible de charger le film le mieux noté.',
    );
  });

  it('renders a provided error message', () => {
    // Arrange and act
    render(
      <BestRatedMovieWidget
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
