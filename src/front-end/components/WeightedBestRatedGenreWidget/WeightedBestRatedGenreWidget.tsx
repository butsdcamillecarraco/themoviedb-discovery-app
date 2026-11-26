import './WeightedBestRatedGenreWidget.css';

/**
 * Props for the weighted best-rated genre widget.
 *
 * The chosen ranking contract is a Bayesian weighted rating:
 * WR = (v / (v + m)) * R + (m / (v + m)) * C
 * where R is the simple mean of valid movie ratings for a genre, v is the
 * number of those movies, C is the simple mean of valid ratings across the
 * catalogue, and m is 5. A movie rating is valid when it is between 0 and 10
 * and the movie has at least one vote. A genre is eligible when v >= 5.
 *
 * These values are precomputed upstream; this component does not apply the
 * weighting formula or rank genres.
 */
export type WeightedBestRatedGenreWidgetProps =
  | { state: 'loading' }
  | { state: 'empty' }
  | { state: 'unavailable' }
  | { state: 'error'; message?: string }
  | { state: 'success'; genreName: string; weightedRating: number };

function renderWidgetContent(props: WeightedBestRatedGenreWidgetProps) {
  switch (props.state) {
    case 'loading':
      return <p role="status">Chargement de la meilleure note pondérée...</p>;
    case 'empty':
      return <p>Aucun genre ne possède assez de notes valides.</p>;
    case 'unavailable':
      return (
        <p>Les notes pondérées par genre ne sont pas encore connectées.</p>
      );
    case 'error':
      return (
        <p role="alert">
          {props.message ?? 'Impossible de charger la meilleure note pondérée.'}
        </p>
      );
    case 'success':
      return (
        <>
          <p className="weighted-best-rated-genre-widget__name">
            {props.genreName}
          </p>
          <p className="weighted-best-rated-genre-widget__value">
            <strong>
              {new Intl.NumberFormat('fr-FR', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }).format(props.weightedRating)}
            </strong>
            <span>/ 10</span>
          </p>
          <p className="weighted-best-rated-genre-widget__description">
            Note pondérée · seuil : 5 films notés
          </p>
        </>
      );
  }
}

export default function WeightedBestRatedGenreWidget(
  props: WeightedBestRatedGenreWidgetProps,
) {
  return (
    <article
      className="weighted-best-rated-genre-widget"
      aria-labelledby="weighted-best-rated-genre-widget-title"
    >
      <header className="weighted-best-rated-genre-widget__header">
        <p
          aria-hidden="true"
          className="weighted-best-rated-genre-widget__icon"
        >
          /10
        </p>
        <h2 id="weighted-best-rated-genre-widget-title">
          Meilleure note pondérée
        </h2>
      </header>
      <div className="weighted-best-rated-genre-widget__content">
        {renderWidgetContent(props)}
      </div>
    </article>
  );
}
