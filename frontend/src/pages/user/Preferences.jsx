import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/footerII';
import * as preferencesService from '../../services/preferencesService';
import '../userXP.css';

const Preferences = () => {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [sessionId, setSessionId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const init = async () => {
      try {
        const qData = await preferencesService.fetchQuestions();
        setQuestions(qData);
        const sData = await preferencesService.startSession();
        setSessionId(sData.session_id);
      } catch (err) {
        console.error("Failed to init quiz", err);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  const handleSelect = async (choiceId) => {
    const currentQ = questions[currentIndex];
    setAnswers({ ...answers, [currentQ.id]: choiceId });
    
    try {
      await preferencesService.submitAnswer(currentQ.id, choiceId, sessionId);
    } catch (err) {
      console.error("Failed to save answer", err);
    }

    if (currentIndex < questions.length - 1) {
      setTimeout(() => setCurrentIndex(currentIndex + 1), 300);
    } else {
      handleFinish();
    }
  };

  const handleFinish = async () => {
    setSubmitting(true);
    try {
      await preferencesService.finishSession(sessionId);
      navigate('/user_profile');
    } catch (err) {
      console.error("Failed to finish", err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="dashboard" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}><h2>Loading Quiz...</h2></div>;

  const currentQ = questions[currentIndex];
  const progress = ((currentIndex) / questions.length) * 100;

  return (
    <div className="dashboard">
      <Navbar />
      <main style={{ padding: '20px' }}>
        <div className="quiz-container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
             <span style={{ fontSize: '0.9rem', color: 'var(--green-400)', fontWeight: 800 }}>QUESTION {currentIndex + 1} OF {questions.length}</span>
             <span style={{ opacity: 0.6, fontSize: '0.8rem' }}>{Math.round(progress)}% Complete</span>
          </div>
          
          <div className="quiz-progress">
            <div className="quiz-progress-fill" style={{ width: `${progress}%` }}></div>
          </div>

          <div className="question-content" style={{ minHeight: '300px', animation: 'fadeIn 0.5s ease-out' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '40px', lineHeight: '1.2' }}>{currentQ?.text}</h2>
            
            <div className="choices-grid" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '15px' }}>
              {currentQ?.choices.map((choice) => (
                <div 
                  key={choice.id} 
                  className={`choice-card ${answers[currentQ.id] === choice.id ? 'selected' : ''}`}
                  onClick={() => handleSelect(choice.id)}
                >
                  <div style={{ width: '24px', height: '24px', borderRadius: '50%', border: '2px solid rgba(255,255,255,0.2)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    {answers[currentQ.id] === choice.id && <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'white' }}></div>}
                  </div>
                  <span style={{ fontSize: '1.1rem', fontWeight: 500 }}>{choice.text}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ marginTop: '40px', display: 'flex', justifyContent: 'space-between' }}>
            <button 
              onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
              disabled={currentIndex === 0}
              style={{ background: 'transparent', color: 'white', border: '1px solid rgba(255,255,255,0.2)', padding: '10px 20px', borderRadius: '10px', cursor: 'pointer', opacity: currentIndex === 0 ? 0.3 : 1 }}
            >
              Previous
            </button>
            {currentIndex === questions.length - 1 && (
               <button className="btn-premium" onClick={handleFinish} disabled={submitting}>
                 {submitting ? 'Processing...' : 'Complete Quiz'}
               </button>
            )}
          </div>
        </div>
      </main>
      <Footer />

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}} />
    </div>
  );
};

export default Preferences;
