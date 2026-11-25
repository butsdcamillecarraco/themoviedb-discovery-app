// @vitest-environment jsdom

import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import MostRepresentedCountryWidget from './MostRepresentedCountryWidget';

afterEach(cleanup);

describe('MostRepresentedCountryWidget', () => {
  it('renders the provided country, movie count, and unit', () => {
    // Arrange and act
    render(
      <MostRepresentedCountryWidget
        state="success"
        countryName="United States of America"
        movieCount={725}
      />,
    );

    // Assert
    expect(
      screen.getByRole('heading', { name: 'Pays le plus représenté' }),
    ).toBeTruthy();
    expect(screen.getByText('United States of America')).toBeTruthy();
    expect(screen.getByText('725')).toBeTruthy();
    expect(screen.getByText('films')).toBeTruthy();
  });

  it('renders long country names without truncating their text', () => {
    // Arrange and act
    render(
      <MostRepresentedCountryWidget
        state="success"
        countryName="Democratic Republic of the Congo"
        movieCount={18}
      />,
    );

    // Assert
    expect(screen.getByText('Democratic Republic of the Congo')).toBeTruthy();
  });

  it('renders a loading message', () => {
    // Arrange and act
    render(<MostRepresentedCountryWidget state="loading" />);

    // Assert
    expect(screen.getByRole('status').textContent).toBe(
      'Chargement des pays de production...',
    );
  });

  it('explains when no production country is known', () => {
    // Arrange and act
    render(<MostRepresentedCountryWidget state="empty" />);

    // Assert
    expect(screen.getByText('Aucun pays de production connu.')).toBeTruthy();
    expect(screen.queryByText('0')).toBeNull();
  });

  it('renders the error message as an alert', () => {
    // Arrange and act
    render(<MostRepresentedCountryWidget state="error" />);

    // Assert
    expect(screen.getByRole('alert').textContent).toBe(
      'Impossible de charger le pays le plus représenté.',
    );
  });

  it('renders a provided error message', () => {
    // Arrange and act
    render(
      <MostRepresentedCountryWidget
        state="error"
        message="Les pays de production sont indisponibles."
      />,
    );

    // Assert
    expect(screen.getByRole('alert').textContent).toBe(
      'Les pays de production sont indisponibles.',
    );
  });

  it('uses the singular unit for one movie', () => {
    // Arrange and act
    render(
      <MostRepresentedCountryWidget
        state="success"
        countryName="France"
        movieCount={1}
      />,
    );

    // Assert
    expect(screen.getByText('film')).toBeTruthy();
  });
});
