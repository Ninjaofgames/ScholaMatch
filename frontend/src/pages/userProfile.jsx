import { useState, useEffect } from "react";
import { useUserAuth } from "../context/UserAuthContext";
import './userXP.css';
import Navbar from '../components/Navbar';
import Footer from '../components/footerII';
import { useNavigate } from 'react-router-dom';
import * as preferencesService from '../services/preferencesService';

const UserProfile = () => {
    const { user, logout } = useUserAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [message, setMessage] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [saveLoading, setSaveLoading] = useState(false);
    const [passwordLoading, setPasswordLoading] = useState(false);
    const [preferences, setPreferences] = useState(null);
    const navigate = useNavigate();
    
    const [formData, setFormData] = useState({
        prenom: '',
        nom: '',
        email: '',
        created_at: ''
    });
    
    const [passwordData, setPasswordData] = useState({
        current_password: '',
        new_password: '',
        confirm_password: '',
    });

    useEffect(() => {
        if (user) {
            setFormData({
                prenom: user.first_name || '',
                nom: user.last_name || '',
                email: user.email || '',
                created_at: user.created_at || '',
            });
        }
    }, [user]);

    useEffect(() => {
        const fetchPrefs = async () => {
            try {
                const data = await preferencesService.fetchMyPreferences();
                setPreferences(data);
            } catch (e) {
                console.error("Preferences fetch failed:", e);
            }
        };
        fetchPrefs();
    }, []);

    const handleSave = async () => {
        setSaveLoading(true);
        setMessage('');
        try {
            await preferencesService.apiClient.put('/auth/update-profile/', formData);
            setMessage('Profile updated successfully!');
            setIsEditing(false);
        } catch {
            setMessage('Failed to update profile.');
        } finally {
            setSaveLoading(false);
        }
    };

    const handlePasswordChange = async () => {
        setPasswordError('');
        if (passwordData.new_password !== passwordData.confirm_password) {
            setPasswordError('Passwords do not match');
            return;
        }
        if (passwordData.new_password.length < 8) {
            setPasswordError('Password must be at least 8 characters');
            return;
        }
        setPasswordLoading(true);
        try {
            await preferencesService.apiClient.put('/auth/change-password/', passwordData);
            setIsChangingPassword(false);
            setPasswordData({ current_password: '', new_password: '', confirm_password: '' });
            setMessage('Password changed successfully!');
        } catch (err) {
            setPasswordError(err.response?.data?.detail || 'Failed to change password.');
        } finally {
            setPasswordLoading(false);
        }
    };

    const getScoreColor = (score) => {
        if (score >= 80) return 'var(--primary-gradient)';
        if (score >= 50) return 'var(--accent-gradient)';
        return 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)';
    };

    return (
        <div className="dashboard">
            <Navbar />
            
            <div className="dashboard-hero">
                <div className="hero-glow"></div>
            </div>

            <main className="dashboard-main" style={{ maxWidth: '900px', margin: '0 auto', padding: '0 20px 60px' }}>
                <div className="profile-card">
                    <div className="avatar-wrapper">
                        <i className="fas fa-user-circle" style={{ fontSize: '110px', color: 'var(--green-500)' }}></i>
                    </div>
                    <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div>
                                <h2 style={{ fontSize: '2.2rem', fontWeight: 900, marginBottom: '5px' }}>{user?.username || 'User Account'}</h2>
                                <p style={{ color: 'var(--text-dim)', fontSize: '1.1rem' }}>{user?.email}</p>
                            </div>
                            <button onClick={() => { logout(); navigate('/login'); }} className="btn-outline-danger" style={{ padding: '10px 15px', borderRadius: '12px' }}>
                                <i className="fas fa-sign-out-alt"></i> Logout
                            </button>
                        </div>
                        <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
                            <span className="badge" style={{ background: 'rgba(39, 174, 96, 0.15)', color: '#2ecc71', padding: '6px 16px', borderRadius: '30px', fontSize: '0.75rem', fontWeight: 800, border: '1px solid rgba(39, 174, 96, 0.3)' }}>
                                {user?.role?.toUpperCase() || 'STUDENT'}
                            </span>
                            <span className="badge" style={{ background: 'rgba(52, 152, 219, 0.15)', color: '#3498db', padding: '6px 16px', borderRadius: '30px', fontSize: '0.75rem', fontWeight: 800, border: '1px solid rgba(52, 152, 219, 0.3)' }}>
                                VERIFIED ACCOUNT
                            </span>
                        </div>
                    </div>
                </div>

                {message && <div className="alert alert-success" style={{ margin: '30px 0' }}>{message}</div>}

                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.2fr) minmax(0, 0.8fr)', gap: '25px', marginTop: '30px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
                        <div className="profile-section">
                            <h3>Account Overview</h3>
                            <div className="profile-fields" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                <div className="profile-field">
                                    <label>First Name</label>
                                    <input type="text" value={formData.prenom} readOnly />
                                </div>
                                <div className="profile-field">
                                    <label>Last Name</label>
                                    <input type="text" value={formData.nom} readOnly />
                                </div>
                                <div className="profile-field" style={{ gridColumn: 'span 2' }}>
                                    <label>Email Address</label>
                                    <input type="text" value={formData.email} readOnly />
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '15px', marginTop: '30px' }}>
                                <button className="btn-premium" onClick={() => setIsEditing(true)} style={{ flex: 1 }}>
                                    Edit Information
                                </button>
                                <button className="btn-premium" style={{ flex: 1, background: 'var(--secondary-gradient)', boxShadow: '0 10px 20px -5px rgba(52, 152, 219, 0.3)' }} onClick={() => setIsChangingPassword(true)}>
                                    Update Password
                                </button>
                            </div>
                        </div>

                        <div className="profile-section">
                            <h3>ScholaMatch Status</h3>
                            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '15px', border: '1px solid var(--glass-border)' }}>
                                <p style={{ fontSize: '0.95rem', lineHeight: '1.6', color: 'var(--text-dim)', marginBottom: 0 }}>
                                    Your account is fully synchronized with our academic recommendation engine. 
                                    {preferences?.has_completed ? " Based on your test results, we have personalized your school exploration experience." : " Complete the personality test to unlock personalized AI matches."}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="profile-section" style={{ height: 'fit-content' }}>
                        <h3>Academic DNA</h3>
                        {preferences && preferences.has_completed ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                                {Object.entries({
                                    'Location': preferences.location_score,
                                    'Financial': preferences.financial_score,
                                    'Pedagogical': preferences.pedagogical_score,
                                    'Infrastructure': preferences.infrastructure_score
                                }).map(([key, score]) => (
                                    <div key={key}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'rgba(255,255,255,0.9)' }}>{key.toUpperCase()}</span>
                                            <span style={{ fontSize: '0.85rem', fontWeight: 900, color: score >= 50 ? '#2ecc71' : '#f39c12' }}>{score}%</span>
                                        </div>
                                        <div className="priority-bar-container">
                                            <div className="priority-bar" style={{ width: `${score}%`, background: getScoreColor(score), height: '100%' }}></div>
                                        </div>
                                    </div>
                                ))}
                                <button className="btn-outline-danger" onClick={() => navigate('/preferences')} style={{ marginTop: '10px', fontSize: '0.85rem', fontWeight: 800, padding: '12px' }}>
                                    Retake Analysis
                                </button>
                            </div>
                        ) : (
                            <div style={{ textAlign: 'center', padding: '20px 0' }}>
                                <div style={{ fontSize: '40px', marginBottom: '15px' }}>🚀</div>
                                <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem', marginBottom: '20px' }}>Discover your academic priorities with our smart test.</p>
                                <button className="btn-premium" onClick={() => navigate('/preferences')} style={{ width: '100%' }}>
                                    Analyze My Profile
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </main>
            <Footer />

            {/* Modals */}
            {isEditing && (
                <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
                    <div className="profile-section" style={{ width: '450px', background: '#121212', boxShadow: '0 0 100px rgba(0,0,0,0.5)' }}>
                        <h3 style={{ fontSize: '1.5rem' }}>Update Profile</h3>
                        <div className="profile-field">
                            <label>First Name</label>
                            <input type="text" value={formData.prenom} onChange={(e) => setFormData({ ...formData, prenom: e.target.value })} />
                        </div>
                        <div className="profile-field">
                            <label>Last Name</label>
                            <input type="text" value={formData.nom} onChange={(e) => setFormData({ ...formData, nom: e.target.value })} />
                        </div>
                        <div className="profile-field">
                            <label>Email Address</label>
                            <input type="text" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                        </div>
                        <div style={{ display: 'flex', gap: '12px', marginTop: '30px' }}>
                            <button className="btn-premium" style={{ flex: 1 }} onClick={handleSave} disabled={saveLoading}>{saveLoading ? 'Applying...' : 'Save Changes'}</button>
                            <button className="btn-outline-danger" style={{ flex: 1 }} onClick={() => setIsEditing(false)}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}

            {isChangingPassword && (
                <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
                    <div className="profile-section" style={{ width: '450px', background: '#121212', boxShadow: '0 0 100px rgba(0,0,0,0.5)' }}>
                        <h3 style={{ fontSize: '1.5rem' }}>Security Update</h3>
                        {passwordError && <div className="alert alert-error" style={{ marginBottom: '15px', color: '#e74c3c', fontSize: '0.9rem' }}>{passwordError}</div>}
                        <div className="profile-field">
                            <label>Current Password</label>
                            <input type="password" value={passwordData.current_password} onChange={(e) => setPasswordData({ ...passwordData, current_password: e.target.value })} placeholder="••••••••" />
                        </div>
                        <div className="profile-field">
                            <label>New Password</label>
                            <input type="password" value={passwordData.new_password} onChange={(e) => setPasswordData({ ...passwordData, new_password: e.target.value })} placeholder="Min 8 characters" />
                        </div>
                        <div className="profile-field">
                            <label>Confirm New Password</label>
                            <input type="password" value={passwordData.confirm_password} onChange={(e) => setPasswordData({ ...passwordData, confirm_password: e.target.value })} placeholder="••••••••" />
                        </div>
                        <div style={{ display: 'flex', gap: '12px', marginTop: '30px' }}>
                            <button className="btn-premium" style={{ flex: 1 }} onClick={handlePasswordChange} disabled={passwordLoading}>{passwordLoading ? 'Updating...' : 'Set Password'}</button>
                            <button className="btn-outline-danger" style={{ flex: 1 }} onClick={() => setIsChangingPassword(false)}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserProfile;