import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserAuth } from '../../context/UserAuthContext';
import * as preferencesService from '../../services/preferencesService';

export default function Preferences() {
  const { isAuthenticated } = useUserAuth();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [sessionId, setSessionId] = useState(null);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    const init = async () => {
      try {
        const [qs, me] = await Promise.all([
          preferencesService.fetchQuestions(),
          preferencesService.fetchMyPreferences(),
        ]);
        setQuestions(qs || []);
        if (me.session) setSessionId(me.session.id);
      } catch {
        setError('Failed to load questions');
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [isAuthenticated, navigate]);

  const total = questions.length;
  const current = questions[currentIndex] || null;
  const progress = total ? ((currentIndex + 1) / total) * 100 : 0;

  const handleStart = async (skip = false) => {
    setSubmitting(true);
    try {
      const res = await preferencesService.startSession(skip);
      setSessionId(res.session_id);
      if (skip) navigate('/dashboard');
    } finally {
      setSubmitting(false);
    }
  };

  const handleNext = async () => {
    if (!current || selected == null || !sessionId) return;
    setSubmitting(true);
    try {
      await preferencesService.submitAnswer(current.id, selected, sessionId);
      if (currentIndex === total - 1) {
        await preferencesService.finishSession(sessionId);
        navigate('/dashboard');
      } else {
        setCurrentIndex((i) => i + 1);
        setSelected(null);
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="loading-screen">Loading preferences…</div>;
  }

  return (
    <div className="preferences-hero-page">
      <header className="preferences-hero-header">
        <div className="preferences-logo">ScholaMatch</div>
      </header>
      <main className="preferences-hero-main">
        <section className="preferences-hero-content">
          <h1 className="preferences-hero-title">
            Personalize Your School
            <br />
            Matches
          </h1>
          <p className="preferences-hero-text">
            Answer a short preference test so we can recommend schools that truly match
            your needs, priorities, and learning goals.
          </p>

          {!sessionId && (
            <div className="preferences-hero-card">
              <h2>Why take this test?</h2>
              <p>
                Your answers help our intelligent system filter and rank schools based on
                what matters most to you — location, budget, quality, and environment.
              </p>
            </div>
          )}

          {!sessionId && (
            <div className="preferences-hero-actions">
              <button
                type="button"
                className="preferences-hero-primary"
                onClick={() => handleStart(false)}
                disabled={submitting}
              >
                Start Preference Test
              </button>
              <button
                type="button"
                className="preferences-hero-skip"
                onClick={() => handleStart(true)}
                disabled={submitting}
              >
                Skip for now
              </button>
            </div>
          )}

          {sessionId && current && (
            <div className="preferences-questions-panel">
              <div className="preferences-progress-bar">
                <div className="preferences-progress-track">
                  <div
                    className="preferences-progress-fill"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <span className="preferences-progress-label">
                  Question {currentIndex + 1} of {total}
                </span>
              </div>
              <h2 className="preferences-question-text">{current.text}</h2>
              <div className="preferences-choices-list">
                {current.choices.map((choice) => (
                  <button
                    key={choice.id}
                    type="button"
                    className={`preferences-choice ${selected === choice.id ? 'preferences-choice-selected' : ''
                      }`}
                    onClick={() => setSelected(choice.id)}
                  >
                    {choice.text}
                  </button>
                ))}
              </div>
              <div className="preferences-questions-footer">
                <button
                  type="button"
                  className="preferences-hero-skip"
                  onClick={() => navigate('/dashboard')}
                >
                  Skip and continue
                </button>
                <button
                  type="button"
                  className="preferences-hero-primary"
                  disabled={selected == null || submitting}
                  onClick={handleNext}
                >
                  {currentIndex === total - 1 ? 'Finish' : 'Next'}
                </button>
              </div>
            </div>
          )}

          {error && (
            <div className="alert alert-error" role="alert">
              {error}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

