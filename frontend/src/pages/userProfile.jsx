import { useState, useEffect } from "react";
import { useUserAuth } from "../context/UserAuthContext";
import axios from "axios";
import './userXP.css';
import Navbar from '../components/Navbar';
import Footer from '../components/footerII';

const UserProfile = () => {
    const { user, logout } = useUserAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [showPasswordForm, setShowPasswordForm] = useState(false);
    const [message, setMessage] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [saveLoading, setSaveLoading] = useState(false);
    const [passwordLoading, setPasswordLoading] = useState(false);
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
    const handleSave = async () => {
        setSaveLoading(true);
        setMessage('');
        try {
            await axios.put('http://127.0.0.1:8000/api/auth/update-profile/', formData, {
                headers: { Authorization: `Token ${localStorage.getItem('scholamatch_user_token')}` }
            });
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
        await axios.put('http://127.0.0.1:8000/api/auth/change-password/', passwordData, {
            headers: { Authorization: `Token ${localStorage.getItem('scholamatch_user_token')}` }
        });
        setShowPasswordForm(false);
        setPasswordData({ current_password: '', new_password: '', confirm_password: '' });
        setMessage('Password changed successfully!');
        } catch (err) {
        setPasswordError(err.response?.data?.detail || 'Failed to change password.');
        } finally {
        setPasswordLoading(false);
        }
    };

    return (
        <div className="dashboard">
        <Navbar />
        <main className="dashboard-main" style={{ maxWidth: '700px', margin: '40px auto', padding: '0 20px' }}>
            <h1 style={{ marginBottom: '30px' }}>My Profile</h1>
            {/* Account informations */}
            <div className="profile-card">
                <div className="profile-avatar">
                    <i className="fas fa-user-circle" style={{ fontSize: '64px', color: 'var(--green-500)' }}></i>
                </div>
                <div>
                    <h2>{user?.username || 'Username'}</h2>
                    <p style={{ opacity: 0.6 }}>{user?.email}</p>
                    <span style={{ background: 'var(--green-600)', color: 'white', padding: '2px 10px', borderRadius: '20px', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 'bold' }}>
                        {user?.role || 'User'}
                    </span>
                </div>
            </div>

            {message && (
                <div className="alert alert-success" style={{ margin: '15px 0' }}>{message}</div>
            )}
            {/* Personal Info */}
            <div className="profile-section">
                <h3>Personal information</h3>
                <div className="profile-fields">
                    <div className="profile-field">
                        <label>First name</label>
                        <input
                            type="text"
                            value={formData.prenom}
                            readOnly={!isEditing}
                            onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
                            style={{ opacity: isEditing ? 1 : 0.7 }}
                        />
                    </div>
                    <div className="profile-field">
                        <label>Last name</label>
                        <input
                            type="text"
                            value={formData.nom}
                            readOnly={!isEditing}
                            onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                            style={{ opacity: isEditing ? 1 : 0.7 }}
                        />
                    </div>
                    <div className="profile-field">
                        <label>Email</label>
                        <input
                            type="email"
                            value={formData.email}
                            readOnly={!isEditing}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            style={{ opacity: isEditing ? 1 : 0.7 }}
                        />
                    </div>
                    <div className="profile-field">
                        <label>Joined at</label>
                        <input
                            type="text"
                            value={formData.created_at.split('T')[0]}
                            readOnly
                        />
                    </div>
                </div>
            </div>
            {/* settings */}
            <div className="profile-section">
                <h3>Settings</h3>
                {!isEditing ? (
                    <button className="btn-primary" onClick={() => setIsEditing(true)} style={{ width: '100%' }}>
                        Edit Profile
                    </button>
                ) : (
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button className="btn-primary" onClick={handleSave} disabled={saveLoading} style={{ flex: 1 }}>
                            {saveLoading ? 'Saving...' : 'Save Changes'}
                        </button>
                        <button onClick={() => setIsEditing(false)} style={{ flex: 1, background: '#555', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
                            Cancel
                        </button>
                    </div>
                )}
                <button
                    onClick={() => setShowPasswordForm(!showPasswordForm)}
                    style={{ width: '100%', marginTop: '10px', background: '#e74c3c', color: 'white', border: 'none', borderRadius: '8px', padding: '10px', cursor: 'pointer' }}
                >
                    {showPasswordForm ? 'Cancel' : 'Change Password'}
                </button>
                <div className={`passwordForm ${showPasswordForm ? 'open' : 'closed'}`} style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px' }}>
                    {passwordError && <div className="alert alert-error">{passwordError}</div>}
                    <div className="profile-field">
                        <label>Current password</label>
                        <input
                            type="password"
                            value={passwordData.current_password}
                            onChange={(e) => setPasswordData({ ...passwordData, current_password: e.target.value })}
                            placeholder="••••••••"
                        />
                    </div>
                    <div className="profile-field">
                        <label>New password</label>
                        <input
                            type="password"
                            value={passwordData.new_password}
                            onChange={(e) => setPasswordData({ ...passwordData, new_password: e.target.value })}
                            placeholder="Min 8 characters"
                        />
                    </div>
                    <div className="profile-field">
                        <label>Confirm new password</label>
                        <input
                            type="password"
                            value={passwordData.confirm_password}
                            onChange={(e) => setPasswordData({ ...passwordData, confirm_password: e.target.value })}
                            placeholder="••••••••"
                        />
                    </div>
                    <button
                        onClick={handlePasswordChange}
                        disabled={passwordLoading}
                        style={{ background: 'var(--green-600)', color: 'white', border: 'none', borderRadius: '8px', padding: '10px', cursor: 'pointer' }}
                        >
                        {passwordLoading ? 'Changing...' : 'Confirm Change'}
                    </button>
                </div>
                <button
                    onClick={logout}
                    style={{ width: '100%', marginTop: '10px', background: 'transparent', color: '#e74c3c', border: '1px solid #e74c3c', borderRadius: '8px', padding: '10px', cursor: 'pointer' }}
                >
                    <i className="fas fa-sign-out-alt"></i> Logout
                </button>
            </div>
        </main>
        <Footer />
        </div>
    );
};

export default UserProfile;