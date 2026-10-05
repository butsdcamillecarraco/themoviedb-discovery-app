import { Link } from 'react-router';
import '../footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__content">
        <p className="footer__copyright">TMDB Discovery</p>
        <ul className="footer__links">
          <li>
            <Link to="/about">À propos</Link>
          </li>
          <li>
            <a
              href="https://github.com/butsdcamillecarraco/themoviedb-discovery-app"
              target="_blank"
              rel="noreferrer"
            >
              GitHub
            </a>
          </li>
          <li>
            <span>Version 1.0.0</span>
          </li>
        </ul>
      </div>
    </footer>
  );
}
