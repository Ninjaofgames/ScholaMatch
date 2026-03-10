import { useState, useEffect } from 'react';
import UserNavbar from '../../components/UserNavbar';
import '../../styles/publicSchools.css';

const API_BASE = 'http://127.0.0.1:8000';

const StarRating = ({ rating = 4 }) => {
  return (
    <span className="ps-stars">
      {[1,2,3,4,5].map(i => (
        <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill={i <= rating ? '#f59e0b' : '#d1d5db'} xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
      ))}
    </span>
  );
};

const SchoolCard = ({ school }) => {
  const hasImage = school.image && !school.image.startsWith('fake') && school.image.trim() !== '';
  const imageUrl = hasImage
    ? (school.image.startsWith('http') ? school.image : `${API_BASE}${school.image}`)
    : null;

  return (
    <div className="ps-card">
      <div className="ps-card-badge">SCHOLAMATCH</div>
      <div className="ps-card-image">
        {imageUrl ? (
          <img src={imageUrl} alt={school.school_name} />
        ) : (
          <div className="ps-card-placeholder">
            <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="8" y="20" width="48" height="36" rx="2" fill="#d1d5db"/>
              <rect x="22" y="8" width="20" height="14" rx="1" fill="#9ca3af"/>
              <rect x="14" y="30" width="8" height="10" rx="1" fill="#9ca3af"/>
              <rect x="42" y="30" width="8" height="10" rx="1" fill="#9ca3af"/>
              <rect x="26" y="38" width="12" height="18" rx="1" fill="#9ca3af"/>
              <circle cx="32" cy="14" r="3" fill="#6b7280"/>
            </svg>
          </div>
        )}
      </div>
      <div className="ps-card-body">
        <h3 className="ps-card-name">{school.school_name}</h3>
        <div className="ps-card-rating">
          <StarRating rating={4} />
          <span className="ps-card-rating-text">4.0 (0 reviews)</span>
        </div>
        <div className="ps-card-location">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
            <circle cx="12" cy="10" r="3"/>
          </svg>
          <span>{school.place || 'Location not set'}</span>
        </div>
        <button className="ps-card-btn">MORE</button>
      </div>
    </div>
  );
};

const PublicSchools = () => {
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchSchools = async () => {
      try {
        const response = await fetch(`${API_BASE}/admin-api/schools/`);
        if (!response.ok) throw new Error(`Failed to fetch schools: ${response.status}`);
        const data = await response.json();
        setSchools(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchSchools();
  }, []);

  const filtered = schools.filter(s =>
    (s.school_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (s.place || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="ps-page">
      <UserNavbar activeTab="schools" />

      {/* Hero / Search */}
      <div className="ps-hero">
        <h1 className="ps-hero-title">Find Your <span className="ps-hero-highlight">Perfect School</span></h1>
        <p className="ps-hero-sub">Browse verified schools and colleges recommended by ScholaMatch</p>
        <div className="ps-search-wrap">
          <svg className="ps-search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            className="ps-search-input"
            type="text"
            placeholder="Search schools or locations..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="ps-content">
        {/* Stats bar */}
        <div className="ps-stats-bar">
          <span className="ps-count">{filtered.length} school{filtered.length !== 1 ? 's' : ''} found</span>
          <div className="ps-tabs">
            <button className="ps-tab ps-tab-active">Schools</button>
            <button className="ps-tab">Partner Portal</button>
          </div>
        </div>

        {/* Content */}
        {loading && (
          <div className="ps-loading">
            <div className="ps-spinner"></div>
            <p>Loading schools...</p>
          </div>
        )}

        {error && (
          <div className="ps-error">
            <p>⚠️ {error}</p>
          </div>
        )}

        {!loading && !error && filtered.length === 0 && (
          <div className="ps-empty">
            <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
              <circle cx="32" cy="32" r="30" fill="#f3f4f6"/>
              <path d="M20 28h24M20 36h16" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <p>No schools found{searchTerm ? ` for "${searchTerm}"` : '. Check back later or ask an admin to add one!'}</p>
          </div>
        )}

        {!loading && !error && filtered.length > 0 && (
          <div className="ps-grid">
            {filtered.map(school => (
              <SchoolCard key={school.id_school} school={school} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PublicSchools;
