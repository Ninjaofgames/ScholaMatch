import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/footerII';
import './userXP.css';

const WelcomeSetup = () => {
  const navigate = useNavigate();

  return (
    <div className="dashboard welcome-page" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <main style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
        <div style={{ maxWidth: '800px', textAlign: 'center', animation: 'fadeInScale 0.8s ease-out' }}>
          <div style={{ fontSize: '60px', marginBottom: '20px' }}>🎉</div>
          <h1 style={{ fontSize: '3.5rem', fontWeight: 900, marginBottom: '20px', background: 'var(--primary-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Welcome to ScholaMatch!
          </h1>
          <p style={{ fontSize: '1.2rem', color: 'var(--text-dim)', marginBottom: '40px', lineHeight: '1.6' }}>
            Your account is verified! To help us find the perfect academic environment for you, we recommend taking a quick 2-minute personality test. Or you can jump straight to exploring schools.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '25px', marginTop: '20px' }}>
            <div className="profile-card welcome-card" onClick={() => navigate('/preferences')} style={{ cursor: 'pointer', flexDirection: 'column', padding: '40px', border: '2px solid transparent', transition: 'all 0.3s ease' }}>
              <div style={{ fontSize: '40px', marginBottom: '15px' }}>🎯</div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '10px' }}>Start Personality Test</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-dim)' }}>Get AI-powered recommendations based on your preferences.</p>
              <button className="btn-premium" style={{ marginTop: '20px', width: '100%' }}>Let's Go</button>
            </div>

            <div className="profile-card welcome-card" onClick={() => navigate('/')} style={{ cursor: 'pointer', flexDirection: 'column', padding: '40px', background: 'rgba(255,255,255,0.02)' }}>
              <div style={{ fontSize: '40px', marginBottom: '15px' }}>🔍</div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '10px' }}>Explore Schools</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-dim)' }}>Browse through our database of schools and universities immediately.</p>
              <button className="btn-premium" style={{ marginTop: '20px', width: '100%', background: 'var(--secondary-gradient)' }}>Skip for now</button>
            </div>
          </div>
        </div>
      </main>
      <Footer />

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fadeInScale {
          from { opacity: 0; transform: scale(0.95) translateY(20px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        .welcome-card:hover {
          border-color: var(--green-500) !important;
          background: rgba(39, 174, 96, 0.05) !important;
          transform: translateY(-10px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.4);
        }
      `}} />
    </div>
  );
};

export default WelcomeSetup;
