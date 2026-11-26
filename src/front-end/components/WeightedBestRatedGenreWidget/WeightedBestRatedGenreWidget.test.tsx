// @vitest-environment jsdom

import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import WeightedBestRatedGenreWidget from './WeightedBestRatedGenreWidget';

afterEach(cleanup);

describe('WeightedBestRatedGenreWidget', () => {
  it('renders the provided genre and its two-decimal weighted rating', () => {
    // Arrange and act
    render(
      <WeightedBestRatedGenreWidget
        state="success"
        genreName="Animation"
        weightedRating={7.68}
      />,
    );

    // Assert
    expect(
      screen.getByRole('heading', { name: 'Meilleure note pondérée' }),
    ).toBeTruthy();
    expect(screen.getByText('Animation')).toBeTruthy();
    expect(screen.getByText('7,68')).toBeTruthy();
    expect(screen.getByText('/ 10')).toBeTruthy();
    expect(
      screen.getByText('Note pondérée · seuil : 5 films notés'),
    ).toBeTruthy();
  });

  it('always formats the weighted rating with two decimal places', () => {
    // Arrange and act
    render(
      <WeightedBestRatedGenreWidget
        state="success"
        genreName="Animation"
        weightedRating={7.6}
      />,
    );

    // Assert
    expect(screen.getByText('7,60')).toBeTruthy();
  });

  it('does not present a genre without enough valid ratings as zero', () => {
    // Arrange and act
    render(<WeightedBestRatedGenreWidget state="empty" />);

    // Assert
    expect(
      screen.getByText('Aucun genre ne possède assez de notes valides.'),
    ).toBeTruthy();
    expect(screen.queryByText('0,00')).toBeNull();
  });

  it('renders a loading message', () => {
    // Arrange and act
    render(<WeightedBestRatedGenreWidget state="loading" />);

    // Assert
    expect(screen.getByRole('status').textContent).toBe(
      'Chargement de la meilleure note pondérée...',
    );
  });

  it('renders the default error message as an alert', () => {
    // Arrange and act
    render(<WeightedBestRatedGenreWidget state="error" />);

    // Assert
    expect(screen.getByRole('alert').textContent).toBe(
      'Impossible de charger la meilleure note pondérée.',
    );
  });

  it('renders a provided error message', () => {
    // Arrange and act
    render(
      <WeightedBestRatedGenreWidget
        state="error"
        message="Le catalogue est indisponible."
      />,
    );

    // Assert
    expect(screen.getByRole('alert').textContent).toBe(
      'Le catalogue est indisponible.',
    );
  });

  it('explains when weighted genre ratings are not connected', () => {
    // Arrange and act
    render(<WeightedBestRatedGenreWidget state="unavailable" />);

    // Assert
    expect(
      screen.getByText(
        'Les notes pondérées par genre ne sont pas encore connectées.',
      ),
    ).toBeTruthy();
  });

  it('renders a long genre name without truncating it', () => {
    // Arrange and act
    render(
      <WeightedBestRatedGenreWidget
        state="success"
        genreName="Science-fiction et aventures spatiales"
        weightedRating={7.68}
      />,
    );

    // Assert
    expect(
      screen.getByText('Science-fiction et aventures spatiales'),
    ).toBeTruthy();
  });
});
