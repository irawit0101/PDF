import { Link } from 'react-router-dom';
import '../styles/LandingPage.css';

export default function LandingPage() {
  return (
    <div className="landing-container">
      {/* Navigation */}
      <nav className="navbar">
        <div className="nav-content">
          <Link to="/" className="nav-brand">
            TenderPDF
          </Link>
          <div className="nav-links">
            <Link to="/" className="nav-link">
              Home
            </Link>
            <Link to="/tender" className="nav-link">
              Generate Tender
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-text">
            <div className="hero-badge">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Professional PDF Generator
            </div>
            <h1 className="hero-title">
              <span>Simplify Your</span>
              <span className="highlight">Tender Management</span>
            </h1>
            <p className="hero-description">
              Transform your tender process with our advanced PDF generator. Create professional documents, automate calculations, and manage your tenders effortlessly.
            </p>
            <div className="hero-buttons">
              <Link to="/tender" className="button button-primary">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Create New Tender
              </Link>
              <a href="#features" className="button button-secondary">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Learn More
              </a>
            </div>
          </div>
        </div>
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
      </section>

      {/* Features Section */}
      {/* Features Section */}
      <section id="features" className="features">
        <div className="features-content">
          <div className="features-header">
            <h2 className="section-title">Powerful Features</h2>
            <p className="section-description">
              Everything you need to create and manage professional tender documents efficiently
            </p>
          </div>

          <div className="features-grid">
            {/* Feature 1 */}
            <div className="feature-card">
              <div className="feature-icon">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="feature-title">Professional PDFs</h3>
              <p className="feature-description">
                Generate beautifully formatted PDF documents with detailed price breakdowns and precise calculations.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="feature-card">
              <div className="feature-icon">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                </svg>
              </div>
              <h3 className="feature-title">Multiple Tenders</h3>
              <p className="feature-description">
                Easily manage and compile multiple tenders into a single, organized PDF document with professional formatting.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="feature-card">
              <div className="feature-icon">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="feature-title">Smart Calculations</h3>
              <p className="feature-description">
                Automated calculations for GST, overtime, and total costs. Save time and eliminate manual calculation errors.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}