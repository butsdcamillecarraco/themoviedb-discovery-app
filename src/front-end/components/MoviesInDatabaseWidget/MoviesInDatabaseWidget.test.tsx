// @vitest-environment jsdom

import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import MoviesInDatabaseWidget from './MoviesInDatabaseWidget';

afterEach(cleanup);

describe('MoviesInDatabaseWidget', () => {
  it('renders the loading state accessibly', () => {
    // Arrange and act
    render(<MoviesInDatabaseWidget state="loading" />);

    // Assert
    expect(screen.getByRole('heading', { name: 'Films en base' })).toBeTruthy();
    expect(screen.getByRole('status').textContent).toBe(
      'Chargement des films...',
    );
  });

  it('renders an empty catalogue message', () => {
    // Arrange and act
    render(<MoviesInDatabaseWidget state="empty" />);

    // Assert
    expect(
      screen.getByText("Aucun film n'est actuellement enregistré."),
    ).toBeTruthy();
  });

  it('renders the localized movie count', () => {
    // Arrange and act
    render(<MoviesInDatabaseWidget state="success" count={1250} />);

    // Assert
    const widget = screen.getByRole('article', { name: 'Films en base' });
    expect(widget.textContent?.replaceAll('\u202f', ' ')).toContain('1 250');
    expect(screen.getByText('films')).toBeTruthy();
  });

  it('renders the error message as an alert', () => {
    // Arrange and act
    render(
      <MoviesInDatabaseWidget
        state="error"
        message="Le catalogue est indisponible."
      />,
    );

    // Assert
    expect(screen.getByRole('alert').textContent).toBe(
      'Le catalogue est indisponible.',
    );
  });

  it('renders a default message when no error details are provided', () => {
    // Arrange and act
    render(<MoviesInDatabaseWidget state="error" />);

    // Assert
    expect(screen.getByRole('alert').textContent).toBe(
      'Impossible de charger le nombre de films.',
    );
  });

  it('explains when catalogue data are not connected', () => {
    // Arrange and act
    render(<MoviesInDatabaseWidget state="unavailable" />);

    // Assert
    expect(
      screen.getByText(
        'Les données du catalogue ne sont pas encore connectées.',
      ),
    ).toBeTruthy();
  });

  it('uses the singular form for a single movie', () => {
    // Arrange and act
    render(<MoviesInDatabaseWidget state="success" count={1} />);

    // Assert
    expect(screen.getByText('1')).toBeTruthy();
    expect(screen.getByText('film')).toBeTruthy();
  });
});
