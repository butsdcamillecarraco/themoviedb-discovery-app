import './RepresentedGenresWidget.css';

/**
 * Props for the represented-genres widget.
 *
 * `genreCount` is the precomputed number of distinct genres in the catalogue.
 * The component does not count movie-genre associations. Use `unavailable`
 * when the count has not been supplied; zero is a valid known count.
 */
export type RepresentedGenresWidgetProps =
  | { state: 'loading' }
  | { state: 'unavailable' }
  | { state: 'error'; message?: string }
  | { state: 'success'; genreCount: number };

function renderWidgetContent(props: RepresentedGenresWidgetProps) {
  switch (props.state) {
    case 'loading':
      return <p role="status">Chargement des genres représentés...</p>;
    case 'unavailable':
      return <p>Le nombre de genres n'est pas disponible.</p>;
    case 'error':
      return (
        <p role="alert">
          {props.message ?? 'Impossible de charger le nombre de genres.'}
        </p>
      );
    case 'success':
      return (
        <p className="represented-genres-widget__value">
          <strong>
            {new Intl.NumberFormat('fr-FR').format(props.genreCount)}
          </strong>
          <span>{props.genreCount === 1 ? 'genre' : 'genres'}</span>
        </p>
      );
  }
}

export default function RepresentedGenresWidget(
  props: RepresentedGenresWidgetProps,
) {
  return (
    <article
      className="represented-genres-widget"
      aria-labelledby="represented-genres-widget-title"
    >
      <header className="represented-genres-widget__header">
        <p aria-hidden="true" className="represented-genres-widget__icon">
          GEN
        </p>
        <h2 id="represented-genres-widget-title">Genres représentés</h2>
      </header>
      <div className="represented-genres-widget__content">
        <p className="represented-genres-widget__description">
          Diversité du catalogue
        </p>
        {renderWidgetContent(props)}
      </div>
    </article>
  );
}
