import { useState } from 'react';
import './MostPopularMovieWidget.css';

/**
 * Movie details displayed by the most-popular movie widget.
 *
 * The popularity value is an upstream index, not a rating or vote count.
 * Null values represent unavailable data; the widget does not calculate it.
 */
export type MostPopularMovie = {
  title: string;
  releaseYear: number | null;
  popularity: number | null;
  posterUrl: string | null;
};

/**
 * Props for the most-popular movie widget.
 *
 * `movie` must be selected by the data source from the complete catalogue.
 */
export type MostPopularMovieWidgetProps =
  | { state: 'loading' }
  | { state: 'empty' }
  | { state: 'error'; message?: string }
  | { state: 'success'; movie: MostPopularMovie };

function MoviePoster({ movie }: { movie: MostPopularMovie }) {
  const [failedPosterUrl, setFailedPosterUrl] = useState<string | null>(null);

  if (!movie.posterUrl || failedPosterUrl === movie.posterUrl) {
    return (
      <div
        className="most-popular-movie-widget__poster most-popular-movie-widget__poster--fallback"
        role="img"
        aria-label={`Affiche indisponible pour ${movie.title}`}
      >
        <span aria-hidden="true">Affiche indisponible</span>
      </div>
    );
  }

  return (
    <img
      className="most-popular-movie-widget__poster"
      src={movie.posterUrl}
      alt={`Affiche de ${movie.title}`}
      onError={() => setFailedPosterUrl(movie.posterUrl)}
    />
  );
}

function renderWidgetContent(props: MostPopularMovieWidgetProps) {
  switch (props.state) {
    case 'loading':
      return <p role="status">Chargement du film le plus populaire...</p>;
    case 'empty':
      return <p>Aucun film populaire n'est disponible.</p>;
    case 'error':
      return (
        <p role="alert">
          {props.message ?? 'Impossible de charger le film le plus populaire.'}
        </p>
      );
    case 'success': {
      const { movie } = props;
      const popularity =
        movie.popularity === null
          ? null
          : new Intl.NumberFormat('fr-FR', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }).format(movie.popularity);

      return (
        <div className="most-popular-movie-widget__movie">
          <MoviePoster movie={movie} />
          <div className="most-popular-movie-widget__details">
            <h3>{movie.title}</h3>
            <dl>
              <div>
                <dt>Année</dt>
                <dd>{movie.releaseYear ?? 'Inconnue'}</dd>
              </div>
              <div>
                <dt>Indice de popularité</dt>
                <dd>
                  {popularity === null ? (
                    <span>Indisponible</span>
                  ) : (
                    <strong>{popularity}</strong>
                  )}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      );
    }
  }
}

export default function MostPopularMovieWidget(
  props: MostPopularMovieWidgetProps,
) {
  return (
    <article
      className="most-popular-movie-widget"
      aria-labelledby="most-popular-movie-widget-title"
    >
      <header className="most-popular-movie-widget__header">
        <h2 id="most-popular-movie-widget-title">Film le plus populaire</h2>
      </header>
      <div className="most-popular-movie-widget__content">
        {renderWidgetContent(props)}
      </div>
    </article>
  );
}
