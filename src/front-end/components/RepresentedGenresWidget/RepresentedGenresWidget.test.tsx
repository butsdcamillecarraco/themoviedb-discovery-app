// @vitest-environment jsdom

import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import RepresentedGenresWidget from './RepresentedGenresWidget';

afterEach(cleanup);

describe('RepresentedGenresWidget', () => {
  it('renders the diversity labels, distinct genre count, and unit', () => {
    // Arrange and act
    render(<RepresentedGenresWidget state="success" genreCount={19} />);

    // Assert
    expect(
      screen.getByRole('heading', { name: 'Genres représentés' }),
    ).toBeTruthy();
    expect(screen.getByText('Diversité du catalogue')).toBeTruthy();
    expect(screen.getByText('19')).toBeTruthy();
    expect(screen.getByText('genres')).toBeTruthy();
  });

  it('shows a valid zero count instead of treating it as unavailable', () => {
    // Arrange and act
    render(<RepresentedGenresWidget state="success" genreCount={0} />);

    // Assert
    expect(screen.getByText('0')).toBeTruthy();
    expect(screen.getByText('genres')).toBeTruthy();
    expect(
      screen.queryByText("Le nombre de genres n'est pas disponible."),
    ).toBeNull();
  });

  it('uses the singular unit for one represented genre', () => {
    // Arrange and act
    render(<RepresentedGenresWidget state="success" genreCount={1} />);

    // Assert
    expect(screen.getByText('genre')).toBeTruthy();
  });

  it('distinguishes an unavailable genre count from a known zero', () => {
    // Arrange and act
    render(<RepresentedGenresWidget state="unavailable" />);

    // Assert
    expect(
      screen.getByText("Le nombre de genres n'est pas disponible."),
    ).toBeTruthy();
    expect(screen.queryByText('0')).toBeNull();
  });

  it('renders a loading message', () => {
    // Arrange and act
    render(<RepresentedGenresWidget state="loading" />);

    // Assert
    expect(screen.getByRole('status').textContent).toBe(
      'Chargement des genres représentés...',
    );
  });

  it('renders the default error message as an alert', () => {
    // Arrange and act
    render(<RepresentedGenresWidget state="error" />);

    // Assert
    expect(screen.getByRole('alert').textContent).toBe(
      'Impossible de charger le nombre de genres.',
    );
  });

  it('renders a provided error message', () => {
    // Arrange and act
    render(
      <RepresentedGenresWidget
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
