import type { MovieDetails } from '../../back-end/schemas/MoviesTypes';
import './MovieDetailCard.css';

type MovieDetailCardProps = {
  movie: MovieDetails;
};

export default function MovieDetailCard({ movie }: MovieDetailCardProps) {
  const releaseYear = movie.release_date
    ? movie.release_date.slice(0, 4)
    : 'Inconnue';
  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : null;

  return (
    <article className="movie-detail-card">
      <div className="movie-detail-card__poster-wrapper">
        {posterUrl ? (
          <img
            className="movie-detail-card__poster"
            src={posterUrl}
            alt={`Affiche de ${movie.title}`}
          />
        ) : (
          <div className="movie-detail-card__poster movie-detail-card__poster--fallback">
            Affiche indisponible
          </div>
        )}
      </div>
      <div className="movie-detail-card__content">
        <p className="movie-detail-card__eyebrow">Détails du film</p>
        <h2>{movie.title}</h2>
        {movie.tagline && (
          <p className="movie-detail-card__tagline">{movie.tagline}</p>
        )}
        <div
          className="movie-detail-card__meta"
          aria-label="Informations principales"
        >
          <span>Année de sortie {releaseYear}</span>
          <span>Note {movie.vote_average.toFixed(1)}</span>
        </div>
        <h3>Genres</h3>
        <ul className="movie-detail-card__genres" aria-label="Genres du film">
          {movie.genres.map((genre) => (
            <li key={genre.id}>{genre.name}</li>
          ))}
        </ul>
        <h3>Résumé</h3>
        <p className="movie-detail-card__overview">
          {movie.overview || 'Aucun résumé disponible.'}
        </p>
      </div>
    </article>
  );
}
