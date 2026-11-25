import './AverageRatingWidget.css';

/**
 * Props for the average-rating widget.
 *
 * `averageRating` is a precomputed simple average for the whole catalogue,
 * not a value calculated from the current page of movies.
 */
export type AverageRatingWidgetProps =
  | { state: 'loading' }
  | { state: 'empty' }
  | { state: 'error'; message?: string }
  | { state: 'success'; averageRating: number };

function renderWidgetContent(props: AverageRatingWidgetProps) {
  switch (props.state) {
    case 'loading':
      return <p role="status">Chargement de la note moyenne...</p>;
    case 'empty':
      return <p>Aucune note n'est disponible dans le catalogue.</p>;
    case 'error':
      return (
        <p role="alert">
          {props.message ?? 'Impossible de charger la note moyenne.'}
        </p>
      );
    case 'success':
      return (
        <>
          <p className="average-rating-widget__value">
            <strong>
              {new Intl.NumberFormat('fr-FR', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }).format(props.averageRating)}
            </strong>
            <span>/ 10</span>
          </p>
          <p className="average-rating-widget__description">
            Moyenne simple du catalogue (non pondérée)
          </p>
        </>
      );
  }
}

export default function AverageRatingWidget(props: AverageRatingWidgetProps) {
  return (
    <article
      className="average-rating-widget"
      aria-labelledby="average-rating-widget-title"
    >
      <header className="average-rating-widget__header">
        <p aria-hidden="true" className="average-rating-widget__icon">
          NOTE
        </p>
        <h2 id="average-rating-widget-title">Note moyenne</h2>
      </header>
      <div className="average-rating-widget__content">
        {renderWidgetContent(props)}
      </div>
    </article>
  );
}
