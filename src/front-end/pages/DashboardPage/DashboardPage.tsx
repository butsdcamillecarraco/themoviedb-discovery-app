import './DashboardPage.css';
import MoviesInDatabaseWidget from '../../components/MoviesInDatabaseWidget/MoviesInDatabaseWidget';

export default function DashboardPage() {
  return (
    <main className="app-shell dashboard-page">
      <header className="dashboard-hero">
        <p className="dashboard-eyebrow">TMDB Discovery</p>
        <h1>Tableau de bord des films</h1>
        <p className="dashboard-intro">
          Retrouvez une vue d'ensemble des films, de leurs genres et de leurs
          pays de production.
        </p>
      </header>

      <section
        className="dashboard-widgets"
        aria-label="Widgets du tableau de bord"
      >
        <MoviesInDatabaseWidget state="unavailable" />
      </section>
    </main>
  );
}
