import { useState, useEffect } from 'react';
import { useUserAuth } from '../../context/UserAuthContext';
import UserNavbar from '../../components/UserNavbar';
import PasswordInput from '../../components/PasswordInput';
import * as userAuthService from '../../services/userAuthService';
import * as preferencesService from '../../services/preferencesService';

const API_URL = 'http://127.0.0.1:8000';

const Profile = () => {
  const { user, refreshUser } = useUserAuth();
  const [editing, setEditing] = useState({ name: false, email: false, password: false });
  const [formData, setFormData] = useState({ first_name: '', last_name: '', email: '' });
  const [passwordData, setPasswordData] = useState({ current_password: '', new_password: '', confirm_password: '' });
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [preferences, setPreferences] = useState(null);

  useEffect(() => {
    if (user) {
      setFormData({ first_name: user.first_name || '', last_name: user.last_name || '', email: user.email || '' });
      preferencesService.fetchMyPreferences()
        .then((data) => setPreferences(data))
        .catch(() => setPreferences(null));
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setMessage({ type: '', text: '' });
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
    setMessage({ type: '', text: '' });
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });
    try {
      const fd = new FormData();
      if (formData.first_name) fd.append('first_name', formData.first_name);
      if (formData.last_name) fd.append('last_name', formData.last_name);
      if (formData.email) fd.append('email', formData.email);
      if (avatarFile) fd.append('avatar', avatarFile);
      const res = await userAuthService.updateProfile(fd);
      if (res.success) {
        setMessage({ type: 'success', text: 'Profile updated successfully!' });
        setEditing({ ...editing, name: false, email: false });
        setAvatarFile(null);
        setAvatarPreview(null);
        refreshUser();
      }
    } catch (err) {
      const errData = err.response?.data?.errors || err.response?.data;
      setMessage({ type: 'error', text: typeof errData === 'object' ? Object.values(errData).flat()[0] : 'Update failed' });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (passwordData.new_password !== passwordData.confirm_password) {
      setMessage({ type: 'error', text: 'Passwords do not match' });
      return;
    }
    setLoading(true);
    setMessage({ type: '', text: '' });
    try {
      const res = await userAuthService.changePassword(passwordData);
      if (res.success) {
        setMessage({ type: 'success', text: 'Password updated successfully!' });
        setPasswordData({ current_password: '', new_password: '', confirm_password: '' });
        setEditing({ ...editing, password: false });
      }
    } catch (err) {
      const errData = err.response?.data?.errors || err.response?.data;
      setMessage({ type: 'error', text: typeof errData === 'object' ? Object.values(errData).flat()[0] : 'Update failed' });
    } finally {
      setLoading(false);
    }
  };

  const avatarUrl = avatarPreview || (user?.avatar_url
    ? (user.avatar_url.startsWith('http') ? user.avatar_url : `${API_URL}${user.avatar_url}`)
    : null);

  const initials = (user?.first_name?.[0] || '') + (user?.last_name?.[0] || '') || user?.email?.[0] || '?';

  const priorityIcons = {
    location: '📍',
    financial: '💰',
    pedagogical: '🎓',
    infrastructure: '🏛️',
  };
  const priorityLabels = {
    location: 'Location',
    financial: 'Budget',
    pedagogical: 'Quality',
    infrastructure: 'Infrastructure',
  };

  return (
    <div className="prof-page">
      <UserNavbar />

      {/* Hero banner */}
      <div className="prof-hero">
        <div className="prof-hero-overlay" />
        <div className="prof-hero-content">
          <label className="prof-avatar-wrap" title="Change photo">
            <input type="file" accept="image/*" onChange={handleAvatarChange} hidden />
            {avatarUrl ? (
              <img src={avatarUrl} alt="Avatar" className="prof-avatar-img" />
            ) : (
              <div className="prof-avatar-initials">{initials.toUpperCase()}</div>
            )}
            <div className="prof-avatar-overlay">
              <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
          </label>
          <div className="prof-hero-info">
            <h1 className="prof-hero-name">
              {user?.first_name || user?.last_name
                ? `${user.first_name || ''} ${user.last_name || ''}`.trim()
                : 'My Profile'}
            </h1>
            <p className="prof-hero-email">{user?.email}</p>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="prof-body">
        {message.text && (
          <div className={`prof-toast prof-toast-${message.type}`}>
            {message.type === 'success' ? '✓' : '✕'} {message.text}
          </div>
        )}

        <div className="prof-grid">
          {/* Left column: Edit profile */}
          <div className="prof-col">
            <div className="prof-card">
              <div className="prof-card-header">
                <div className="prof-card-icon">
                  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h2 className="prof-card-title">Personal Info</h2>
              </div>

              <form onSubmit={handleProfileUpdate} className="prof-form">
                <div className="prof-form-row">
                  <div className="prof-field">
                    <label className="prof-label">First Name</label>
                    <div className="prof-input-wrap">
                      <input
                        className="prof-input"
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleChange}
                        placeholder="First name"
                        disabled={!editing.name}
                      />
                    </div>
                  </div>
                  <div className="prof-field">
                    <label className="prof-label">Last Name</label>
                    <div className="prof-input-wrap">
                      <input
                        className="prof-input"
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleChange}
                        placeholder="Last name"
                        disabled={!editing.name}
                      />
                    </div>
                  </div>
                </div>
                <div className="prof-field-actions">
                  <button
                    type="button"
                    className={`prof-toggle-btn ${editing.name ? 'active' : ''}`}
                    onClick={() => setEditing({ ...editing, name: !editing.name })}
                  >
                    {editing.name ? 'Lock Name' : 'Edit Name'}
                  </button>
                </div>

                <div className="prof-field">
                  <label className="prof-label">Email Address</label>
                  <div className="prof-input-wrap">
                    <input
                      className="prof-input"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Email"
                      disabled={!editing.email}
                    />
                  </div>
                  <div className="prof-field-actions">
                    <button
                      type="button"
                      className={`prof-toggle-btn ${editing.email ? 'active' : ''}`}
                      onClick={() => setEditing({ ...editing, email: !editing.email })}
                    >
                      {editing.email ? 'Lock Email' : 'Edit Email'}
                    </button>
                  </div>
                </div>

                {avatarFile && (
                  <p className="prof-avatar-notice">📎 New photo selected: {avatarFile.name}</p>
                )}

                <button type="submit" className="prof-save-btn" disabled={loading}>
                  {loading ? <span className="prof-spinner" /> : 'Save Changes'}
                </button>
              </form>
            </div>

            {/* Password card */}
            <div className="prof-card" style={{ marginTop: '1.5rem' }}>
              <div className="prof-card-header">
                <div className="prof-card-icon">
                  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h2 className="prof-card-title">Security</h2>
              </div>

              {!editing.password ? (
                <button
                  type="button"
                  className="prof-toggle-btn"
                  style={{ marginTop: '0.5rem' }}
                  onClick={() => setEditing({ ...editing, password: true })}
                >
                  Change Password
                </button>
              ) : (
                <form onSubmit={handlePasswordUpdate} className="prof-form">
                  <PasswordInput
                    label="Current password"
                    name="current_password"
                    value={passwordData.current_password}
                    onChange={handlePasswordChange}
                    required
                  />
                  <PasswordInput
                    label="New password"
                    name="new_password"
                    value={passwordData.new_password}
                    onChange={handlePasswordChange}
                    required
                  />
                  <PasswordInput
                    label="Confirm new password"
                    name="confirm_password"
                    value={passwordData.confirm_password}
                    onChange={handlePasswordChange}
                    required
                  />
                  <div className="prof-btn-row">
                    <button type="submit" className="prof-save-btn" disabled={loading}>
                      {loading ? <span className="prof-spinner" /> : 'Update Password'}
                    </button>
                    <button
                      type="button"
                      className="prof-cancel-btn"
                      onClick={() => setEditing({ ...editing, password: false })}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>

          {/* Right column: Preferences */}
          <div className="prof-col">
            <div className="prof-card prof-pref-card">
              <div className="prof-card-header">
                <div className="prof-card-icon">
                  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h2 className="prof-card-title">School Preferences</h2>
              </div>

              {!preferences ? (
                <div className="prof-pref-loading">Loading preferences…</div>
              ) : !preferences.has_completed ? (
                <div className="prof-pref-empty">
                  <div className="prof-pref-empty-icon">🎯</div>
                  <p className="prof-pref-empty-text">
                    You haven&apos;t taken the preference test yet. Let us help you find your perfect school match!
                  </p>
                  <a href="/preferences" className="prof-pref-cta">
                    Take the Test →
                  </a>
                </div>
              ) : (
                <>
                  <p className="prof-pref-subtitle">Your school matching priorities</p>
                  <div className="prof-pref-grid">
                    {Object.entries(preferences.tags || {}).map(([code, level]) => (
                      <div key={code} className={`prof-pref-item prof-pref-${level?.toLowerCase?.() || 'medium'}`}>
                        <span className="prof-pref-icon">{priorityIcons[code] || '⭐'}</span>
                        <div className="prof-pref-info">
                          <span className="prof-pref-label">{priorityLabels[code] || code}</span>
                          <span className="prof-pref-level">{level}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <a href="/preferences" className="prof-pref-retake">
                    Retake Test
                  </a>
                </>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
