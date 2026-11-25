import './AverageDurationWidget.css';

/**
 * Props for the average-duration widget.
 *
 * `averageMinutes` must be calculated from valid movie durations before it is
 * passed to the component. Use the `empty` state when no valid durations exist.
 */
export type AverageDurationWidgetProps =
  | { state: 'loading' }
  | { state: 'empty' }
  | { state: 'error'; message?: string }
  | { state: 'success'; averageMinutes: number };

function renderWidgetContent(props: AverageDurationWidgetProps) {
  switch (props.state) {
    case 'loading':
      return <p role="status">Calcul de la durée moyenne...</p>;
    case 'empty':
      return <p>Aucune durée valide n'est disponible.</p>;
    case 'error':
      return (
        <p role="alert">
          {props.message ?? 'Impossible de charger la durée moyenne.'}
        </p>
      );
    case 'success':
      return (
        <p className="average-duration-widget__value">
          <strong>
            {new Intl.NumberFormat('fr-FR', {
              maximumFractionDigits: 20,
            }).format(props.averageMinutes)}
          </strong>
          <span>min</span>
        </p>
      );
  }
}

export default function AverageDurationWidget(
  props: AverageDurationWidgetProps,
) {
  return (
    <article
      className="average-duration-widget"
      aria-labelledby="average-duration-widget-title"
    >
      <header className="average-duration-widget__header">
        <p aria-hidden="true" className="average-duration-widget__icon">
          MIN
        </p>
        <h2 id="average-duration-widget-title">Durée moyenne</h2>
      </header>
      <div className="average-duration-widget__content">
        {renderWidgetContent(props)}
      </div>
    </article>
  );
}
