import './MostRepresentedCountryWidget.css';

/**
 * Props for the most-represented-country widget.
 *
 * `countryName` and `movieCount` are precomputed catalogue aggregates.
 * The count must represent distinct movies associated with that country;
 * the component does not inspect or recount movie-country associations.
 */
export type MostRepresentedCountryWidgetProps =
  | { state: 'loading' }
  | { state: 'empty' }
  | { state: 'error'; message?: string }
  | { state: 'success'; countryName: string; movieCount: number };

function renderWidgetContent(props: MostRepresentedCountryWidgetProps) {
  switch (props.state) {
    case 'loading':
      return <p role="status">Chargement des pays de production...</p>;
    case 'empty':
      return <p>Aucun pays de production connu.</p>;
    case 'error':
      return (
        <p role="alert">
          {props.message ?? 'Impossible de charger le pays le plus représenté.'}
        </p>
      );
    case 'success':
      return (
        <>
          <p className="most-represented-country-widget__country">
            {props.countryName}
          </p>
          <p className="most-represented-country-widget__count">
            <strong>
              {new Intl.NumberFormat('fr-FR').format(props.movieCount)}
            </strong>
            <span>{props.movieCount === 1 ? 'film' : 'films'}</span>
          </p>
        </>
      );
  }
}

export default function MostRepresentedCountryWidget(
  props: MostRepresentedCountryWidgetProps,
) {
  return (
    <article
      className="most-represented-country-widget"
      aria-labelledby="most-represented-country-widget-title"
    >
      <header className="most-represented-country-widget__header">
        <p aria-hidden="true" className="most-represented-country-widget__icon">
          PAYS
        </p>
        <h2 id="most-represented-country-widget-title">
          Pays le plus représenté
        </h2>
      </header>
      <div className="most-represented-country-widget__content">
        {renderWidgetContent(props)}
      </div>
    </article>
  );
}
