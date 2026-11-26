import { useState } from 'react';
import './LeastProfitableMovieWidget.css';

/**
 * Movie details displayed by the least-profitable movie widget.
 *
 * `roiPercentage` is a precomputed percentage using
 * `(investment gain - investment cost) / investment cost * 100`.
 * Eligibility rules for unknown or zero budgets and revenues are not defined;
 * do not connect this result to real data until those rules are validated.
 */
export type LeastProfitableMovie = {
  title: string;
  releaseYear: number | null;
  roiPercentage: number | null;
  posterUrl: string | null;
};

/**
 * Props for the least-profitable movie widget.
 *
 * The component displays the supplied result and does not calculate or rank ROI.
 */
export type LeastProfitableMovieWidgetProps =
  | { state: 'loading' }
  | { state: 'empty' }
  | { state: 'unavailable' }
  | { state: 'error'; message?: string }
  | { state: 'success'; movie: LeastProfitableMovie };

function MoviePoster({ movie }: { movie: LeastProfitableMovie }) {
  const [failedPosterUrl, setFailedPosterUrl] = useState<string | null>(null);

  if (!movie.posterUrl || failedPosterUrl === movie.posterUrl) {
    return (
      <div
        className="least-profitable-movie-widget__poster least-profitable-movie-widget__poster--fallback"
        role="img"
        aria-label={`Affiche indisponible pour ${movie.title}`}
      >
        <span aria-hidden="true">Affiche indisponible</span>
      </div>
    );
  }

  return (
    <img
      className="least-profitable-movie-widget__poster"
      src={movie.posterUrl}
      alt={`Affiche de ${movie.title}`}
      onError={() => setFailedPosterUrl(movie.posterUrl)}
    />
  );
}

function renderWidgetContent(props: LeastProfitableMovieWidgetProps) {
  switch (props.state) {
    case 'loading':
      return <p role="status">Chargement du film le moins rentable...</p>;
    case 'empty':
      return <p>Aucun film éligible n'est disponible.</p>;
    case 'unavailable':
      return (
        <p>
          Règles d'éligibilité des budgets et recettes à valider avant de
          connecter le catalogue.
        </p>
      );
    case 'error':
      return (
        <p role="alert">
          {props.message ?? 'Impossible de charger le film le moins rentable.'}
        </p>
      );
    case 'success': {
      const { movie } = props;
      const roi =
        movie.roiPercentage === null
          ? null
          : new Intl.NumberFormat('fr-FR', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }).format(movie.roiPercentage);

      return (
        <div className="least-profitable-movie-widget__movie">
          <MoviePoster movie={movie} />
          <div className="least-profitable-movie-widget__details">
            <h3>{movie.title}</h3>
            <dl>
              <div>
                <dt>Année</dt>
                <dd>{movie.releaseYear ?? 'Inconnue'}</dd>
              </div>
              <div>
                <dt>ROI</dt>
                <dd>
                  {roi === null ? (
                    <span>Indisponible</span>
                  ) : (
                    <strong>{roi} %</strong>
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

export default function LeastProfitableMovieWidget(
  props: LeastProfitableMovieWidgetProps,
) {
  return (
    <article
      className="least-profitable-movie-widget"
      aria-labelledby="least-profitable-movie-widget-title"
    >
      <header className="least-profitable-movie-widget__header">
        <h2 id="least-profitable-movie-widget-title">Film le moins rentable</h2>
      </header>
      <div className="least-profitable-movie-widget__content">
        {renderWidgetContent(props)}
      </div>
    </article>
  );
}
