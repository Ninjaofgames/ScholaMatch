import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Home = () => {
  const [query, setQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState([]);
  const [schools, setSchools] = useState([]);
  const [searchMode, setSearchMode] = useState('');
  const [filterPanelOpen, setFilterPanelOpen] = useState(false);

  // Fetch from Django API
  useEffect(() => {
    const fetchSchools = async () => {
      try {
        const qs = new URLSearchParams();
        if (query) qs.append('q', query);
        activeFilters.forEach(f => qs.append('filter', f));
        
        const response = await fetch(`/api/schools/?${qs.toString()}`);
        if (response.ok) {
          const data = await response.json();
          setSchools(data.results || []);
          setSearchMode(data.search_mode || '');
        }
      } catch (error) {
        console.error("Failed to fetch schools", error);
      }
    };
    
    fetchSchools(); 
  }, [query, activeFilters]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
  };

  const toggleFilters = () => {
    setFilterPanelOpen(!filterPanelOpen);
  };

  const handleFilterChange = (e) => {
    const value = e.target.value;
    if (e.target.checked) {
      setActiveFilters([...activeFilters, value]);
    } else {
      setActiveFilters(activeFilters.filter(f => f !== value));
    }
  };

  const clearFilters = () => {
    setActiveFilters([]);
    setQuery('');
  };

  return (
    <>
      <Navbar activeLink="schools" />

      {/* ═══════════ MAIN SEARCH SECTION ═══════════ */}
      <section className="home-search-section">
        <div className="search-container">
          {/* Search + Filter Toggle Row */}
          <form className="search-bar-form" id="search-form" onSubmit={handleSearchSubmit}>
            <div className="search-input-wrapper">
              <i className="fas fa-search search-icon"></i>
              <input 
                type="text" 
                name="q" 
                placeholder="Try: good teachers, affordable tuition, great campus..."
                value={query} 
                onChange={(e) => setQuery(e.target.value)}
                autoComplete="off"
              />
            </div>
            <button 
              type="button" 
              id="filter-toggle-btn" 
              className="filter-toggle-btn"
              aria-expanded={filterPanelOpen ? "true" : "false"}
              onClick={toggleFilters}
            >
              <i className="fas fa-sliders-h"></i>
              <span id="filter-btn-label">{filterPanelOpen ? 'Hide Filters' : 'Filters'}</span>
              <i 
                className="fas fa-chevron-down" 
                id="filter-chevron"
                style={{ transform: filterPanelOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
              ></i>
            </button>

            {/* Filter Dropdown Card (inside form for multi-select) */}
            <div 
              className="filter-dropdown-card" 
              id="filter-panel" 
              style={{ display: filterPanelOpen ? 'block' : 'none' }}
            >
              <div className="filter-chips-inline">
                <label className={`filter-chip ${activeFilters.includes('good teachers') ? 'active' : ''}`}>
                  <input 
                    type="checkbox" 
                    name="filter" 
                    value="good teachers" 
                    style={{ display: 'none' }}
                    onChange={handleFilterChange}
                    checked={activeFilters.includes('good teachers')}
                  />
                  <i className="fas fa-chalkboard-teacher"></i> Good Teachers
                </label>
                
                <label className={`filter-chip ${activeFilters.includes('affordable') ? 'active' : ''}`}>
                  <input 
                    type="checkbox" 
                    name="filter" 
                    value="affordable" 
                    style={{ display: 'none' }}
                    onChange={handleFilterChange}
                    checked={activeFilters.includes('affordable')}
                  />
                  <i className="fas fa-dollar-sign"></i> Affordable
                </label>
                
                <label className={`filter-chip ${activeFilters.includes('good facilities') ? 'active' : ''}`}>
                  <input 
                    type="checkbox" 
                    name="filter" 
                    value="good facilities" 
                    style={{ display: 'none' }}
                    onChange={handleFilterChange}
                    checked={activeFilters.includes('good facilities')}
                  />
                  <i className="fas fa-building"></i> Good Facilities
                </label>
                
                <label className={`filter-chip ${activeFilters.includes('recommended') ? 'active' : ''}`}>
                  <input 
                    type="checkbox" 
                    name="filter" 
                    value="recommended" 
                    style={{ display: 'none' }}
                    onChange={handleFilterChange}
                    checked={activeFilters.includes('recommended')}
                  />
                  <i className="fas fa-thumbs-up"></i> Recommended
                </label>
                
                {(activeFilters.length > 0 || query) && (
                  <button type="button" onClick={clearFilters} className="filter-clear-btn-inline">
                    <i className="fas fa-times"></i> Clear
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
      </section>

      {searchMode === 'smart' && (
        <div className="ai-search-badge">
          <i className="fas fa-robot"></i>
          <span>AI-powered search — results matched from student reviews</span>
        </div>
      )}
      {searchMode === 'filter' && (
        <div className="ai-search-badge">
          <i className="fas fa-filter"></i>
          <span>Filtered by comment keywords</span>
        </div>
      )}

      {/* ═══════════ SCHOOL CARDS ═══════════ */}
      <main className="schools-section">
        {schools && schools.length > 0 ? (
          <div className="school-grid">
            {schools.map(school => (
              <article key={school.id} className="school-card" id={`school-card-${school.id}`}>
                <div className="card-image">
                  {school.thumbnail_url ? (
                    <img src={school.thumbnail_url} alt={school.name} />
                  ) : (
                    <div className="card-image-placeholder">
                      <i className="fas fa-school"></i>
                    </div>
                  )}
                  <span className="card-badge">scholamatch</span>
                </div>
                <div className="card-body">
                  <h2 className="card-title">{school.name}</h2>
                  <div className="card-rating">
                    {[1, 2, 3, 4, 5].map(i => (
                      <i key={i} className={`fas fa-star ${i <= school.rating ? 'filled' : ''}`}></i>
                    ))}
                    <span className="rating-text">{school.rating} ({school.review_count} reviews)</span>
                  </div>
                  <p className="card-location">
                    <i className="fas fa-location-dot"></i>
                    {school.location || "No location"}
                  </p>
                </div>
                <Link to={`/school/${school.id}`} className="card-more-btn">MORE</Link>
              </article>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <i className="fas fa-school"></i>
            {query || activeFilters.length > 0 ? (
              <>
                <h2>No schools found for "{query || 'your filters'}"</h2>
                <p>Try a different search term or <button onClick={clearFilters} style={{background:'none',border:'none',color:'inherit',textDecoration:'underline',cursor:'pointer'}}>view all schools</button>.</p>
              </>
            ) : (
              <>
                <h2>No schools yet</h2>
                <p>Schools added through the <Link to="/admin">admin panel</Link> will appear here.</p>
              </>
            )}
          </div>
        )}
      </main>

      <Footer />
    </>
  );
};

export default Home;
