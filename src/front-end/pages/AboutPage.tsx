import '../about.css';

const technologies = [
  ['TypeScript', 'Typage et fiabilité'],
  ['React', 'Interface composable'],
  ['Node.js + Express', 'API légère'],
  ['Vite', 'Développement rapide'],
];

export default function AboutPage() {
  return (
    <main className="about-page">
      <section className="about-hero">
        <p className="about-eyebrow">TMDB Discovery</p>
        <h1>À propos de l'application</h1>
        <p>
          Une application de découverte de films, pensée comme une expérience
          web claire, rapide et maintenable.
        </p>
      </section>
      <section className="about-section">
        <div>
          <p className="about-eyebrow">Le projet</p>
          <h2>Découvrir, comparer, choisir</h2>
        </div>
        <p>
          Cette application utilise l&apos;API de The Movie Database pour rendre
          les films populaires faciles à explorer. Elle démontre la construction
          d&apos;une application complète, du front-end à l&apos;API.
        </p>
      </section>
      <section className="about-section about-section--stack">
        <div>
          <p className="about-eyebrow">Fondations techniques</p>
          <h2>Une stack volontairement simple</h2>
        </div>
        <ul className="about-tech-list">
          {technologies.map(([name, description]) => (
            <li key={name}>
              <strong>{name}</strong>
              <span>{description}</span>
            </li>
          ))}
        </ul>
      </section>
      <a
        className="about-repository"
        href="https://github.com/butsdcamillecarraco/themoviedb-discovery-app"
        target="_blank"
        rel="noreferrer"
      >
        <span>
          <small>Code source</small>
          Voir la réalisation du projet
        </span>
        <strong>Ouvrir le dépôt GitHub</strong>
      </a>
    </main>
  );
}
