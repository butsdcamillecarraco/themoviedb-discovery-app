// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import MostPopularMovieWidget from './MostPopularMovieWidget';

afterEach(cleanup);

const movie = {
  title: 'The Shawshank Redemption',
  releaseYear: 1994,
  popularity: 1036.49,
  posterUrl: 'https://example.com/poster.jpg',
};

describe('MostPopularMovieWidget', () => {
  it('renders the provided movie, poster, year, and formatted popularity index', () => {
    // Arrange and act
    render(<MostPopularMovieWidget state="success" movie={movie} />);

    // Assert
    const widget = screen.getByRole('article', {
      name: 'Film le plus populaire',
    });
    expect(
      screen
        .getByRole('img', { name: `Affiche de ${movie.title}` })
        .getAttribute('src'),
    ).toBe(movie.posterUrl);
    expect(screen.getByRole('heading', { name: movie.title })).toBeTruthy();
    expect(screen.getByText('1994')).toBeTruthy();
    expect(widget.textContent?.replace('\u202f', ' ')).toContain('1 036,49');
    expect(screen.getByText('Indice de popularité')).toBeTruthy();
    expect(screen.queryByText('/ 10')).toBeNull();
    expect(screen.queryByText(/votes/i)).toBeNull();
  });

  it('uses an explicit accessible fallback when the poster is missing', () => {
    // Arrange and act
    render(
      <MostPopularMovieWidget
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

  it('uses an explicit fallback when the poster cannot be loaded', () => {
    // Arrange
    render(<MostPopularMovieWidget state="success" movie={movie} />);
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

  it('distinguishes unknown popularity from a zero popularity index', () => {
    // Arrange and act
    const { rerender } = render(
      <MostPopularMovieWidget
        state="success"
        movie={{ ...movie, popularity: null }}
      />,
    );

    // Assert: missing data is not displayed as zero.
    expect(screen.getByText('Indisponible')).toBeTruthy();
    expect(screen.queryByText('0,00')).toBeNull();

    // Act: zero is rendered when it is the provided value.
    rerender(
      <MostPopularMovieWidget
        state="success"
        movie={{ ...movie, popularity: 0 }}
      />,
    );

    // Assert
    expect(screen.getByText('0,00')).toBeTruthy();
  });

  it('keeps a long movie title visible when its year is unknown', () => {
    // Arrange
    const longTitle =
      'A Very Long Demonstration Movie Title That Must Remain Readable on Small Screens';

    // Act
    render(
      <MostPopularMovieWidget
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
    render(<MostPopularMovieWidget state="loading" />);

    // Assert
    expect(screen.getByRole('status').textContent).toBe(
      'Chargement du film le plus populaire...',
    );
  });

  it('renders an empty state when no popular movie is available', () => {
    // Arrange and act
    render(<MostPopularMovieWidget state="empty" />);

    // Assert
    expect(
      screen.getByText("Aucun film populaire n'est disponible."),
    ).toBeTruthy();
  });

  it('renders the default error message as an alert', () => {
    // Arrange and act
    render(<MostPopularMovieWidget state="error" />);

    // Assert
    expect(screen.getByRole('alert').textContent).toBe(
      'Impossible de charger le film le plus populaire.',
    );
  });

  it('renders a provided error message', () => {
    // Arrange and act
    render(
      <MostPopularMovieWidget
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
