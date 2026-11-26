import './DominantGenreWidget.css';

/**
 * Props for the dominant-genre widget.
 *
 * `genreName` and `movieCount` are precomputed catalogue aggregates.
 * The count represents distinct movies for this genre; the component does not
 * recount films or their genre associations.
 */
export type DominantGenreWidgetProps =
  | { state: 'loading' }
  | { state: 'empty' }
  | { state: 'error'; message?: string }
  | { state: 'success'; genreName: string; movieCount: number };

function renderWidgetContent(props: DominantGenreWidgetProps) {
  switch (props.state) {
    case 'loading':
      return <p role="status">Chargement du genre dominant...</p>;
    case 'empty':
      return <p>Aucun genre connu dans le catalogue.</p>;
    case 'error':
      return (
        <p role="alert">
          {props.message ?? 'Impossible de charger le genre dominant.'}
        </p>
      );
    case 'success':
      return (
        <>
          <p className="dominant-genre-widget__name">{props.genreName}</p>
          <p className="dominant-genre-widget__count">
            <strong>
              {new Intl.NumberFormat('fr-FR').format(props.movieCount)}
            </strong>
            <span>{props.movieCount === 1 ? 'film' : 'films'}</span>
          </p>
        </>
      );
  }
}

export default function DominantGenreWidget(props: DominantGenreWidgetProps) {
  return (
    <article
      className="dominant-genre-widget"
      aria-labelledby="dominant-genre-widget-title"
    >
      <header className="dominant-genre-widget__header">
        <p aria-hidden="true" className="dominant-genre-widget__icon">
          GEN
        </p>
        <h2 id="dominant-genre-widget-title">Genre dominant</h2>
      </header>
      <div className="dominant-genre-widget__content">
        {renderWidgetContent(props)}
      </div>
    </article>
  );
}
