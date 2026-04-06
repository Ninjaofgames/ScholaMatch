import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './PersonalityTest.css';

const PersonalityTest = () => {
    const navigate = useNavigate();
    const [testData, setTestData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentStep, setCurrentStep] = useState(0);
    const [answers, setAnswers] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [closing, setClosing] = useState(false); // for exit animation

    useEffect(() => {
        const fetchTest = async () => {
            try {
                const token = localStorage.getItem('token');
                const headers = token ? { 'Authorization': `Token ${token}` } : {};
                
                const res = await fetch('http://localhost:8000/api/preferences/questions/', { headers });
                if (!res.ok) throw new Error("No test found.");
                const data = await res.json();
                setTestData({ questions: data });

                // Check for active session
                const prefRes = await fetch('http://localhost:8000/api/preferences/me/', { headers });
                const prefData = await prefRes.json();
                
                if (prefData.session?.id) {
                    setSessionId(prefData.session.id);
                } else {
                    const startRes = await fetch('http://localhost:8000/api/preferences/start/', {
                        method: 'POST',
                        headers: { ...headers, 'Content-Type': 'application/json' },
                        body: JSON.stringify({ skip: false })
                    });
                    const startData = await startRes.json();
                    setSessionId(startData.session_id);
                }
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };
        fetchTest();
    }, []);

    const [sessionId, setSessionId] = useState(null);

    const handleChoiceSelect = async (questionId, choiceId) => {
        setAnswers(prev => ({ ...prev, [questionId]: choiceId }));
        
        try {
            const token = localStorage.getItem('token');
            await fetch('http://localhost:8000/api/preferences/submit/', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${token}`
                },
                body: JSON.stringify({ question_id: questionId, answer_id: choiceId, session_id: sessionId })
            });

            if (currentStep < testData.questions.length - 1) {
                setCurrentStep(prev => prev + 1);
            } else {
                await submitTest();
            }
        } catch (err) {
            console.error(err);
            setError("Failed to save answer.");
        }
    };

    const submitTest = async () => {
        setSubmitting(true);
        const token = localStorage.getItem('token');
        try {
            const res = await fetch('http://localhost:8000/api/preferences/finish/', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${token}`
                },
                body: JSON.stringify({ session_id: sessionId })
            });
            if (res.ok) {
                setSubmitting(false);
                setSubmitted(true);
            } else {
                throw new Error("Failed to finish session");
            }
        } catch (err) {
            setSubmitting(false);
            setError("Something went wrong saving your results.");
        }
    };

    const handleClose = () => {
        setClosing(true);
        setTimeout(() => navigate('/'), 600); // exit animation duration
    };

    if (loading) {
        return (
            <div className="pt-loader-container">
                <div className="pt-loader"></div>
                <p>Analyzing parameters...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="pt-error-container">
                <h2>Oops!</h2>
                <p>{error}</p>
                <button className="pt-btn" onClick={() => navigate('/')}>Return Home</button>
            </div>
        );
    }

    if (submitted) {
        return (
            <div className={`pt-container ${closing ? 'pt-fade-out' : 'pt-fade-in'}`}>
                <div className="pt-success-card">
                    <div className="pt-success-icon"><i className="fa-solid fa-check-circle"></i></div>
                    <h2>Test Complete!</h2>
                    <p>Your personality profile has been saved. We are preparing tailored recommendations based on your unique traits.</p>
                    <button className="pt-btn-primary" onClick={handleClose}>View Dashboard</button>
                </div>
            </div>
        );
    }

    const question = testData.questions[currentStep];
    const progress = ((currentStep) / testData.questions.length) * 100;

    return (
        <div className={`pt-container ${closing ? 'pt-fade-out' : 'pt-fade-in'}`}>
            <div className="pt-topbar">
                <button className="pt-back-btn" onClick={handleClose}>
                    <i className="fa-solid fa-arrow-left"></i> Exit
                </button>
                <div className="pt-progress-wrapper">
                    <div className="pt-progress-bar">
                        <div className="pt-progress-fill" style={{ width: `${progress}%` }}></div>
                    </div>
                    <span className="pt-progress-text">{currentStep + 1} / {testData.questions.length}</span>
                </div>
            </div>
            
            <div className="pt-quiz-card" key={question.id}>
                <h2 className="pt-question">{question.text}</h2>
                <div className="pt-choices">
                    {question.choices.map((choice, i) => {
                        const isSelected = answers[question.id] === choice.id;
                        return (
                            <button 
                                key={choice.id}
                                className={`pt-choice-btn ${isSelected ? 'selected' : ''}`}
                                style={{ animationDelay: `${i * 0.1}s` }}
                                onClick={() => handleChoiceSelect(question.id, choice.id)}
                            >
                                <span className="pt-choice-text">{choice.text}</span>
                                <div className="pt-choice-indicator"></div>
                            </button>
                        );
                    })}
                </div>
            </div>
            {submitting && (
                <div className="pt-submitting-overlay">
                    <div className="pt-loader"></div>
                    <p>Processing results...</p>
                </div>
            )}
        </div>
    );
};

export default PersonalityTest;
