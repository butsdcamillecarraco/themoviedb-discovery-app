import { useState } from 'react';
import './BestRatedMovieWidget.css';

/**
 * Movie details displayed by the best-rated movie widget.
 *
 * This movie is selected upstream from the complete catalogue, not from a
 * single page of results. `releaseYear` is null when no year is known.
 */
export type BestRatedMovie = {
  title: string;
  releaseYear: number | null;
  rating: number;
  posterUrl: string | null;
};

/**
 * Props for the best-rated movie widget.
 *
 * `movie` must be the top-rated catalogue movie, selected by the data source.
 */
export type BestRatedMovieWidgetProps =
  | { state: 'loading' }
  | { state: 'empty' }
  | { state: 'error'; message?: string }
  | { state: 'success'; movie: BestRatedMovie };

function MoviePoster({ movie }: { movie: BestRatedMovie }) {
  const [failedPosterUrl, setFailedPosterUrl] = useState<string | null>(null);

  if (!movie.posterUrl || failedPosterUrl === movie.posterUrl) {
    return (
      <div
        className="best-rated-movie-widget__poster best-rated-movie-widget__poster--fallback"
        role="img"
        aria-label={`Affiche indisponible pour ${movie.title}`}
      >
        <span aria-hidden="true">Affiche indisponible</span>
      </div>
    );
  }

  return (
    <img
      className="best-rated-movie-widget__poster"
      src={movie.posterUrl}
      alt={`Affiche de ${movie.title}`}
      onError={() => setFailedPosterUrl(movie.posterUrl)}
    />
  );
}

function renderWidgetContent(props: BestRatedMovieWidgetProps) {
  switch (props.state) {
    case 'loading':
      return <p role="status">Chargement du film le mieux noté...</p>;
    case 'empty':
      return <p>Aucun film noté n'est disponible.</p>;
    case 'error':
      return (
        <p role="alert">
          {props.message ?? 'Impossible de charger le film le mieux noté.'}
        </p>
      );
    case 'success': {
      const { movie } = props;
      const rating = new Intl.NumberFormat('fr-FR', {
        minimumFractionDigits: 1,
        maximumFractionDigits: 1,
      }).format(movie.rating);

      return (
        <div className="best-rated-movie-widget__movie">
          <MoviePoster movie={movie} />
          <div className="best-rated-movie-widget__details">
            <h3>{movie.title}</h3>
            <dl>
              <div>
                <dt>Année</dt>
                <dd>{movie.releaseYear ?? 'Inconnue'}</dd>
              </div>
              <div>
                <dt>Note</dt>
                <dd>
                  <strong>{rating}</strong> / 10
                </dd>
              </div>
            </dl>
          </div>
        </div>
      );
    }
  }
}

export default function BestRatedMovieWidget(props: BestRatedMovieWidgetProps) {
  return (
    <article
      className="best-rated-movie-widget"
      aria-labelledby="best-rated-movie-widget-title"
    >
      <header className="best-rated-movie-widget__header">
        <h2 id="best-rated-movie-widget-title">Film le mieux noté</h2>
      </header>
      <div className="best-rated-movie-widget__content">
        {renderWidgetContent(props)}
      </div>
    </article>
  );
}
