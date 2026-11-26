// @vitest-environment jsdom

import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import DominantGenreWidget from './DominantGenreWidget';

afterEach(cleanup);

describe('DominantGenreWidget', () => {
  it('renders the provided genre name, count, and plural unit', () => {
    // Arrange and act
    render(
      <DominantGenreWidget
        state="success"
        genreName="Drame"
        movieCount={322}
      />,
    );

    // Assert
    expect(
      screen.getByRole('heading', { name: 'Genre dominant' }),
    ).toBeTruthy();
    expect(screen.getByText('Drame')).toBeTruthy();
    expect(screen.getByText('322')).toBeTruthy();
    expect(screen.getByText('films')).toBeTruthy();
  });

  it('renders a long genre name without truncating it', () => {
    // Arrange and act
    render(
      <DominantGenreWidget
        state="success"
        genreName="Science-fiction et aventures spatiales"
        movieCount={28}
      />,
    );

    // Assert
    expect(
      screen.getByText('Science-fiction et aventures spatiales'),
    ).toBeTruthy();
  });

  it('renders a loading message', () => {
    // Arrange and act
    render(<DominantGenreWidget state="loading" />);

    // Assert
    expect(screen.getByRole('status').textContent).toBe(
      'Chargement du genre dominant...',
    );
  });

  it('explains when there is no known genre', () => {
    // Arrange and act
    render(<DominantGenreWidget state="empty" />);

    // Assert
    expect(
      screen.getByText('Aucun genre connu dans le catalogue.'),
    ).toBeTruthy();
  });

  it('renders the default error message as an alert', () => {
    // Arrange and act
    render(<DominantGenreWidget state="error" />);

    // Assert
    expect(screen.getByRole('alert').textContent).toBe(
      'Impossible de charger le genre dominant.',
    );
  });

  it('renders a provided error message', () => {
    // Arrange and act
    render(
      <DominantGenreWidget
        state="error"
        message="Le catalogue est indisponible."
      />,
    );

    // Assert
    expect(screen.getByRole('alert').textContent).toBe(
      'Le catalogue est indisponible.',
    );
  });

  it('uses the singular unit for one associated movie', () => {
    // Arrange and act
    render(
      <DominantGenreWidget state="success" genreName="Drame" movieCount={1} />,
    );

    // Assert
    expect(screen.getByText('film')).toBeTruthy();
  });
});
