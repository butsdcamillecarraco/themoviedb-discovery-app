import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router';
import type { MovieDetails } from '../../back-end/schemas/MoviesTypes';
import { DEFAULT_LANGUAGE } from '../../back-end/constants';
import MovieDetailCard from './MovieDetailCard';
import '../app.css';

export default function MovieDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [error, setError] = useState(false);
  const hasInvalidId = !id;

  useEffect(() => {
    if (!id) return;

    const query = new URLSearchParams({ language: DEFAULT_LANGUAGE });
    fetch(`/api/movies/${id}?${query.toString()}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch movie details');
        }
        return response.json() as Promise<MovieDetails>;
      })
      .then(setMovie)
      .catch(() => setError(true));
  }, [id]);

  return (
    <main className="app-shell">
      {movie ? (
        <>
          <header className="movie-detail-header">
            <h1>Détails du film</h1>
            <Link to="/movies">← Retour vers les films populaires</Link>
          </header>
          <MovieDetailCard movie={movie} />
        </>
      ) : hasInvalidId || error ? (
        <section className="status-message">
          <h1>Film introuvable</h1>
          <p>Les détails de ce film ne sont pas disponibles.</p>
          <Link to="/movies">Retour vers les films populaires</Link>
        </section>
      ) : (
        <p className="status-message">Chargement des détails...</p>
      )}
    </main>
  );
}
