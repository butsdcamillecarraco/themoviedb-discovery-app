import './DashboardPage.css';

export default function DashboardPage() {
  return (
    <main className="app-shell dashboard-page">
      <header className="dashboard-hero">
        <p className="dashboard-eyebrow">TMDB Discovery</p>
        <h1>Tableau de bord des films</h1>
        <p className="dashboard-intro">
          Retrouvez prochainement une vue d'ensemble des films, de leurs genres
          et de leurs pays de production.
        </p>
      </header>

      <section
        className="dashboard-empty-state"
        aria-labelledby="dashboard-empty-title"
      >
        <p className="dashboard-empty-state__icon" aria-hidden="true">
          +
        </p>
        <h2 id="dashboard-empty-title">Aucun widget configuré</h2>
        <p>
          Le tableau de bord est prêt à accueillir vos widgets de suivi des
          films.
        </p>
      </section>
    </main>
  );
}
