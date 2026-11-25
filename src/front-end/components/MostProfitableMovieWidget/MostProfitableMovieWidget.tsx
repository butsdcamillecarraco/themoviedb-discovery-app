import { useState } from 'react';
import './MostProfitableMovieWidget.css';

/**
 * Movie details displayed by the most-profitable movie widget.
 *
 * `roiPercentage` must be precomputed upstream using
 * `(investment gain - investment cost) / investment cost * 100`.
 * Eligibility rules for unknown or zero budgets and revenues are not defined;
 * do not connect this result to real data until those rules are validated.
 */
export type MostProfitableMovie = {
  title: string;
  releaseYear: number | null;
  roiPercentage: number | null;
  posterUrl: string | null;
};

/**
 * Props for the most-profitable movie widget.
 *
 * The component displays the supplied result and does not calculate or rank ROI.
 */
export type MostProfitableMovieWidgetProps =
  | { state: 'loading' }
  | { state: 'empty' }
  | { state: 'unavailable' }
  | { state: 'error'; message?: string }
  | { state: 'success'; movie: MostProfitableMovie };

function MoviePoster({ movie }: { movie: MostProfitableMovie }) {
  const [failedPosterUrl, setFailedPosterUrl] = useState<string | null>(null);

  if (!movie.posterUrl || failedPosterUrl === movie.posterUrl) {
    return (
      <div
        className="most-profitable-movie-widget__poster most-profitable-movie-widget__poster--fallback"
        role="img"
        aria-label={`Affiche indisponible pour ${movie.title}`}
      >
        <span aria-hidden="true">Affiche indisponible</span>
      </div>
    );
  }

  return (
    <img
      className="most-profitable-movie-widget__poster"
      src={movie.posterUrl}
      alt={`Affiche de ${movie.title}`}
      onError={() => setFailedPosterUrl(movie.posterUrl)}
    />
  );
}

function renderWidgetContent(props: MostProfitableMovieWidgetProps) {
  switch (props.state) {
    case 'loading':
      return <p role="status">Chargement du film le plus rentable...</p>;
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
          {props.message ?? 'Impossible de charger le film le plus rentable.'}
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
        <div className="most-profitable-movie-widget__movie">
          <MoviePoster movie={movie} />
          <div className="most-profitable-movie-widget__details">
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

export default function MostProfitableMovieWidget(
  props: MostProfitableMovieWidgetProps,
) {
  return (
    <article
      className="most-profitable-movie-widget"
      aria-labelledby="most-profitable-movie-widget-title"
    >
      <header className="most-profitable-movie-widget__header">
        <h2 id="most-profitable-movie-widget-title">Film le plus rentable</h2>
      </header>
      <div className="most-profitable-movie-widget__content">
        {renderWidgetContent(props)}
      </div>
    </article>
  );
}
