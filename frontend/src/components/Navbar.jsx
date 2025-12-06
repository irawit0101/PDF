import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const location = useLocation();

  return (
    <nav className="nav-container">
      <div className="nav-content">
        <Link to="/" className="nav-brand">
          Tender PDF Generator
        </Link>
        <div className="nav-links">
          <Link
            to="/"
            className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
          >
            Home
          </Link>
          <Link
            to="/tender"
            className={`nav-link ${location.pathname === '/tender' ? 'active' : ''}`}
          >
            Generate Tender
          </Link>
        </div>
      </div>
    </nav>
  );
}