import './DashboardPage.css';
import AverageRatingWidget from '../../components/AverageRatingWidget/AverageRatingWidget';

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
        className="dashboard-widgets"
        aria-label="Widgets du tableau de bord"
      >
        <AverageRatingWidget state="empty" />
      </section>
    </main>
  );
}
