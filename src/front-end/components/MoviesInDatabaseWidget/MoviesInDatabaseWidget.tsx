import './MoviesInDatabaseWidget.css';

type MoviesInDatabaseWidgetProps =
  | { state: 'loading' }
  | { state: 'empty' }
  | { state: 'error'; message?: string }
  | { state: 'unavailable' }
  | { state: 'success'; count: number };

function renderWidgetContent(props: MoviesInDatabaseWidgetProps) {
  switch (props.state) {
    case 'loading':
      return <p role="status">Chargement des films...</p>;
    case 'empty':
      return <p>Aucun film n'est actuellement enregistré.</p>;
    case 'error':
      return (
        <p role="alert">
          {props.message ?? 'Impossible de charger le nombre de films.'}
        </p>
      );
    case 'unavailable':
      return <p>Les données du catalogue ne sont pas encore connectées.</p>;
    case 'success':
      return (
        <p className="movies-in-database-widget__count">
          <strong>{new Intl.NumberFormat('fr-FR').format(props.count)}</strong>
          <span>{props.count > 1 ? 'films' : 'film'}</span>
        </p>
      );
  }
}

export default function MoviesInDatabaseWidget(
  props: MoviesInDatabaseWidgetProps,
) {
  return (
    <article
      className="movies-in-database-widget"
      aria-labelledby="movies-in-database-widget-title"
    >
      <header className="movies-in-database-widget__header">
        <p aria-hidden="true" className="movies-in-database-widget__icon">
          DB
        </p>
        <h2 id="movies-in-database-widget-title">Films en base</h2>
      </header>
      <div className="movies-in-database-widget__content">
        {renderWidgetContent(props)}
      </div>
    </article>
  );
}
