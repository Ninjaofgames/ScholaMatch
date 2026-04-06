import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

import './userXP.css';
import Navbar from '../components/Navbar';
import Footer from '../components/footerII';
import { useUserAuth } from '../context/UserAuthContext';
import { getUserToken } from '../services/userAuthService';

const SchoolDetail = () => {
  const { id } = useParams();
  const { user, isAuthenticated } = useUserAuth();
  
  // State for dynamic data
  const [messages, setMessages] = useState([]);
  const [school, setSchool] = useState(null);
  const [aspectPositivity, setAspectPositivity] = useState({
    teachers: 0, facilities: 0, administration: 0, affordability: 0
  });
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Comment form state
  const [commentUsername, setCommentUsername] = useState("");
  const [commentText, setCommentText] = useState("");

  useEffect(() => {
    const fetchSchoolData = async () => {
      try {
        setLoading(true);
        console.log("Fetching data for school ID:", id);
        
        // Fetch school details
        const detailRes = await fetch(`http://127.0.0.1:8000/api/schools/${id}/`);
        if (detailRes.ok) {
          const data = await detailRes.json();
          console.log("School detail data received:", data);
          setSchool(data);
          if (data.aspectPositivity) {
             setAspectPositivity(data.aspectPositivity);
          }
        } else {
          console.error("Failed to fetch school detail. Status:", detailRes.status);
        }
        
        // Fetch comments
        const commentsRes = await fetch(`http://127.0.0.1:8000/api/schools/${id}/comments/`);
        if (commentsRes.ok) {
          const commentsData = await commentsRes.json();
          setComments(commentsData);
        }
      } catch (error) {
        console.error("Error in fetchSchoolData:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchSchoolData();
  }, [id]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    const finalUsername = isAuthenticated ? (user?.username || "Anonymous") : commentUsername;
    if (!finalUsername || !commentText) return;
    
    // Get token for authentication header
    const token = getUserToken();
    
    try {
      console.log("Attempting to post comment to:", `/api/schools/${id}/comments/`);
      const res = await fetch(`http://127.0.0.1:8000/api/schools/${id}/comments/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Token ${token}` } : {})
        },
        body: JSON.stringify({
          username: isAuthenticated ? (user?.username) : commentUsername,
          text: commentText
        })
      });
      
      console.log("Post response status:", res.status);
      
      if (res.ok) {
        const newComment = await res.json();
        console.log("Comment successfully saved:", newComment);
        
        // Update local comments list immediately
        setComments(prevComments => {
            const updated = [newComment, ...prevComments];
            console.log("Local comments state updated. New length:", updated.length);
            return updated;
        });
        
        // Clear form
        setCommentText("");
        setCommentUsername("");
        
        // Refresh school data for AI score updates (don't block the UI)
        fetch(`http://127.0.0.1:8000/api/schools/${id}/`).then(res => {
            if (res.ok) return res.json();
        }).then(data => {
            if (data) {
                console.log("Refreshed school data for scores:", data);
                setSchool(data);
                if (data.aspectPositivity) setAspectPositivity(data.aspectPositivity);
            }
        }).catch(err => console.error("Error refreshing school data:", err));

      } else {
        const errData = await res.text();
        console.error("Server error during comment submission:", errData);
        alert(`Failed to post comment. Server error: ${res.status}. Check console.`);
      }
    } catch (err) {
      console.error("Fetch error during comment submission:", err);
      alert("Something went wrong. Is the server running?");
    }
  };

  // Helper for inline SVG aspect arcs
  const getAspectStroke = (pct) => {
    const val = parseFloat(pct);
    if (val >= 66) return '#22c55e'; // green
    if (val >= 34) return '#f59e0b'; // amber
    return '#ef4444'; // red
  };

  if (loading) return <div style={{padding: '100px', textAlign: 'center'}}>Loading School Details...</div>;
  if (!school) return <div style={{padding: '100px', textAlign: 'center'}}><h2>School not found</h2><p>Check the ID or visit the <Link to="/">home page</Link>.</p></div>;

  // Ensure numeric scores for calculation
  const sentimentScore = parseFloat(school.sentiment_score || 0);

  return (
    <>
      <Navbar />

      {/* ═══════════ DETAIL CONTENT ═══════════ */}
      <main className="detail-page">
        {messages && messages.length > 0 && (
          <div className="messages">
            {messages.map((message, idx) => (
              <div key={idx} className={`message message-${message.tags}`}>{message.text}</div>
            ))}
          </div>
        )}

        {/* Top Section: Image + Header + Contact */}
        <section className="detail-top">
          <div className="detail-thumbnail">
            {school.thumbnail_url ? (
              <img src={school.thumbnail_url} alt={school.name} />
            ) : (
              <div className="detail-thumb-placeholder">
                <i className="fas fa-school"></i>
              </div>
            )}

            {school.website_link && (
              <a href={school.website_link} target="_blank" rel="noopener noreferrer" className="btn-action">
                <i className="fas fa-globe"></i> View school's website
              </a>
            )}
            {school.location_link && (
              <a href={school.location_link} target="_blank" rel="noopener noreferrer" className="btn-action">
                <i className="fas fa-location-dot"></i> Open school's location
              </a>
            )}
          </div>

          <div className="detail-header">
            <h1>{school.name}</h1>
            <div className="detail-rating">
              {[1, 2, 3, 4, 5].map(i => (
                <i key={i} className={`fas fa-star ${i <= school.rating ? 'filled' : ''}`}></i>
              ))}
              <span>{school.rating} ({school.review_count} reviews)</span>
            </div>

            <p className="detail-meta">
              {school.university_name && <>{school.university_name} &bull; </>}
              {school.funding_type_display} &bull; {school.education_level_display}
            </p>

            {school.recommended_for && (
              <span className="badge-recommended">{school.recommended_for}</span>
            )}

            {/* Info & Contact Grid (identical symmetrical cards) */}
            <div className="info-contact-grid">
              {/* Informations Card */}
              <div className="info-card">
                <h2><i className="fas fa-info-circle"></i> Informations</h2>
                <div className="info-content">
                  {school.description ? (
                    <p>{school.description}</p>
                  ) : (
                    <p className="text-muted">No description available yet.</p>
                  )}
                </div>
              </div>

              {/* Contact Card */}
              <div className="contact-card">
                <h2><i className="fas fa-address-book"></i> Contact</h2>
                <div className="contact-content">
                  <ul>
                    {school.mail && (
                      <li><i className="fas fa-envelope"></i> <span>{school.mail}</span></li>
                    )}
                    {school.phone && (
                      <li><i className="fas fa-phone"></i> <span>{school.phone}</span></li>
                    )}
                    {school.location && (
                      <li><i className="fas fa-location-dot"></i> <span>{school.location}</span></li>
                    )}
                    {!school.mail && !school.phone && !school.location && (
                      <li className="text-muted">No contact info available.</li>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* AI Recommendation — full width, split desktop layout */}
        <section className="detail-section-full">
          <div className="ai-recommendation-card">
            <div className="ai-header-col">
              <div className="ai-badge-icon"><i className="fas fa-bolt"></i></div>
              <h3>AI recommendation</h3>
              <p className="ai-intro">Why this school matches you</p>
            </div>
            <div className="ai-list-col">
              <ul className="ai-bullet-list">
                {school.ai_recommendation_list && school.ai_recommendation_list.length > 0 ? (
                  school.ai_recommendation_list.map((item, idx) => (
                    <li key={idx}><i className="fas fa-check"></i> {item}</li>
                  ))
                ) : (
                  <>
                    <li><i className="fas fa-check"></i> Strong in Computer science</li>
                    <li><i className="fas fa-check"></i> High employment rate</li>
                    <li><i className="fas fa-check"></i> Positive student rate</li>
                    <li><i className="fas fa-check"></i> Affordable tuition</li>
                  </>
                )}
              </ul>
            </div>
          </div>
        </section>

        {/* Keywords — full width */}
        <section className="detail-section-full">
          <div className="programs-block programs-block--full">
            <h3><i className="fas fa-tags"></i> Keywords</h3>
            <div className="tag-list">
              {school.programs_list && school.programs_list.length > 0 ? (
                school.programs_list.map((prog, idx) => (
                  <span key={`p-${idx}`} className="tag">{prog}</span>
                ))
              ) : school.keywords_list && school.keywords_list.length > 0 ? (
                school.keywords_list.map((kw, idx) => (
                  <span key={`k-${idx}`} className="tag">{kw}</span>
                ))
              ) : (
                <span className="text-muted">No keywords listed</span>
              )}
            </div>
          </div>
        </section>

        {/* Sentiment + Comments Row */}
        <section className="detail-row">
          <div className="sentiment-block">
            <h3><i className="fas fa-face-smile"></i> Sentiment score</h3>
            <div className="sentiment-meter">
              <div className="sentiment-circle">
                <svg viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="42" className="track" />
                  <circle 
                    cx="50" cy="50" r="42" 
                    className="fill"
                    style={{ strokeDashoffset: `calc(264 - (264 * ${sentimentScore}) / 100)` }} 
                  />
                </svg>
                <span className="sentiment-value">{sentimentScore}%</span>
                <span className="sentiment-label">positive</span>
              </div>
              <div className="sentiment-badge">
                <i className="fas fa-robot"></i>
              </div>
            </div>

            {/* Aspect Positivity Gauges */}
            <div className="aspect-scores">
              <p className="aspect-scores-label"><i className="fas fa-chart-pie"></i> Aspect positivity</p>
              <div className="aspect-gauges">
                
                {   [
                  { key: 'teachers', label: 'Teachers', icon: 'fa-chalkboard-teacher' },
                  { key: 'facilities', label: 'Facilities', icon: 'fa-building' },
                  { key: 'administration', label: 'Admin', icon: 'fa-user-tie' },
                  { key: 'affordability', label: 'Affordability', icon: 'fa-dollar-sign' }
                ].map(aspect => {
                  const pct = parseFloat(aspectPositivity[aspect.key]) || 0;
                  return (
                    <div key={aspect.key} className="aspect-gauge">
                      <div className="aspect-arc" style={{ '--pct': pct }}>
                        <svg viewBox="0 0 80 80">
                          <circle cx="40" cy="40" r="32" className="a-track" />
                          <circle 
                            cx="40" cy="40" r="32" 
                            className="a-fill"
                            style={{ 
                              strokeDashoffset: `calc(201 - (201 * ${pct}) / 100)`,
                              stroke: getAspectStroke(pct)
                            }}
                          />
                        </svg>
                        <span className="a-value">{pct}%</span>
                      </div>
                      <span className="a-label"><i className={`fas ${aspect.icon}`}></i> {aspect.label}</span>
                    </div>
                  );
                })}

              </div>
            </div>
          </div>

          <div className="comments-block">
            <h3><i className="fas fa-comments"></i> Comments</h3>
            <form onSubmit={handleCommentSubmit} className="comment-form">
              {!isAuthenticated && (
                <input 
                  type="text" 
                  name="username" 
                  placeholder="Your name" 
                  className="comment-name-input"
                  value={commentUsername}
                  onChange={(e) => setCommentUsername(e.target.value)}
                />
              )}
              <div className="comment-input-row">
                <input 
                  type="text" 
                  name="comment_text" 
                  placeholder="Leave a comment about this school..."
                  className="comment-text-input"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                />
                <button type="submit" className="comment-send-btn"><i className="fas fa-paper-plane"></i></button>
              </div>
            </form>

            <div className="comments-list">
              {comments && comments.length > 0 ? (
                comments.map((comment, idx) => (
                  <div key={idx} className="comment-item">
                    <div className="comment-avatar"><i className="fas fa-user-circle"></i></div>
                    <div className="comment-content">
                      <div className="comment-header">
                        <strong>{comment.username}</strong>
                        <span className={`sentiment-badge sentiment-${comment.sentiment}`}>
                          {comment.sentiment === 'good' ? <><i className="fas fa-face-smile"></i> Good</> :
                           comment.sentiment === 'bad' ? <><i className="fas fa-face-frown"></i> Bad</> :
                           <><i className="fas fa-face-meh"></i> Neutral</>}
                        </span>
                      </div>
                      <p>{comment.text}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-muted no-comments">No comments yet. Be the first to share your experience!</p>
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default SchoolDetail;