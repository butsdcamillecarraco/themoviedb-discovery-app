import './BestRatedGenreWidget.css';

/**
 * Props for the best-rated genre widget.
 *
 * `averageRating` is a precomputed simple arithmetic mean over valid movie
 * ratings for the genre, not a weighted rating. The component does not
 * calculate or rank genres. Use `empty` when no valid ratings exist.
 */
export type BestRatedGenreWidgetProps =
  | { state: 'loading' }
  | { state: 'empty' }
  | { state: 'unavailable' }
  | { state: 'error'; message?: string }
  | { state: 'success'; genreName: string; averageRating: number };

function renderWidgetContent(props: BestRatedGenreWidgetProps) {
  switch (props.state) {
    case 'loading':
      return <p role="status">Chargement de la meilleure note par genre...</p>;
    case 'empty':
      return <p>Aucune note valide n'est disponible pour les genres.</p>;
    case 'unavailable':
      return <p>Les notes par genre ne sont pas encore connectées.</p>;
    case 'error':
      return (
        <p role="alert">
          {props.message ??
            'Impossible de charger la meilleure note par genre.'}
        </p>
      );
    case 'success':
      return (
        <>
          <p className="best-rated-genre-widget__name">{props.genreName}</p>
          <p className="best-rated-genre-widget__value">
            <strong>
              {new Intl.NumberFormat('fr-FR', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }).format(props.averageRating)}
            </strong>
            <span>/ 10</span>
          </p>
          <p className="best-rated-genre-widget__description">
            Moyenne simple (non pondérée)
          </p>
        </>
      );
  }
}

export default function BestRatedGenreWidget(props: BestRatedGenreWidgetProps) {
  return (
    <article
      className="best-rated-genre-widget"
      aria-labelledby="best-rated-genre-widget-title"
    >
      <header className="best-rated-genre-widget__header">
        <p aria-hidden="true" className="best-rated-genre-widget__icon">
          /10
        </p>
        <h2 id="best-rated-genre-widget-title">Meilleure note</h2>
      </header>
      <div className="best-rated-genre-widget__content">
        {renderWidgetContent(props)}
      </div>
    </article>
  );
}
