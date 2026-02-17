import { useState, useEffect } from 'react';
import { useUserAuth } from '../../context/UserAuthContext';
import UserNavbar from '../../components/UserNavbar';
import Button from '../../components/Button';
import Input from '../../components/Input';
import PasswordInput from '../../components/PasswordInput';
import * as userAuthService from '../../services/userAuthService';

const API_URL = 'http://127.0.0.1:8000';

const Profile = () => {
  const { user, refreshUser } = useUserAuth();
  const [editing, setEditing] = useState({ name: false, email: false, password: false });
  const [formData, setFormData] = useState({ first_name: '', last_name: '', email: '' });
  const [passwordData, setPasswordData] = useState({ current_password: '', new_password: '', confirm_password: '' });
  const [avatarFile, setAvatarFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    if (user) {
      setFormData({ first_name: user.first_name || '', last_name: user.last_name || '', email: user.email || '' });
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
        setMessage({ type: 'success', text: 'Profile updated' });
        setEditing({ ...editing, name: false, email: false });
        setAvatarFile(null);
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
        setMessage({ type: 'success', text: 'Password updated' });
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

  const avatarUrl = user?.avatar_url ? (user.avatar_url.startsWith('http') ? user.avatar_url : `${API_URL}${user.avatar_url}`) : null;

  return (
    <div className="dashboard">
      <UserNavbar />
      <main className="dashboard-main profile-page">
        {message.text && (
          <div className={`alert alert-${message.type}`}>{message.text}</div>
        )}
        <div className="profile-card">
          <div className="profile-avatar-section">
            <div className="avatar-wrapper">
              {avatarUrl ? (
                <img src={avatarUrl} alt="Avatar" className="profile-avatar" />
              ) : (
                <div className="profile-avatar-placeholder">
                  {user?.first_name?.[0] || user?.email?.[0] || '?'}
                </div>
              )}
            </div>
            <label className="avatar-upload-btn">
              <input type="file" accept="image/*" onChange={(e) => setAvatarFile(e.target.files?.[0])} hidden />
              Change photo
            </label>
          </div>
          <form onSubmit={handleProfileUpdate}>
            <div className="profile-field">
              <label>Name</label>
              <div className="profile-field-row">
                <Input
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  placeholder="First name"
                  disabled={!editing.name}
                />
                <Input
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  placeholder="Last name"
                  disabled={!editing.name}
                />
                <button type="button" className="edit-icon-btn" onClick={() => setEditing({ ...editing, name: !editing.name })}>✎</button>
              </div>
            </div>
            <div className="profile-field">
              <label>Email</label>
              <div className="profile-field-row">
                <Input name="email" type="email" value={formData.email} onChange={handleChange} disabled={!editing.email} />
                <button type="button" className="edit-icon-btn" onClick={() => setEditing({ ...editing, email: !editing.email })}>✎</button>
              </div>
            </div>
            <Button type="submit" loading={loading}>Save changes</Button>
          </form>
          <hr className="profile-divider" />
          <form onSubmit={handlePasswordUpdate}>
            <h3>Change password</h3>
            {!editing.password ? (
              <button type="button" className="edit-icon-btn" onClick={() => setEditing({ ...editing, password: true })}>✎ Edit</button>
            ) : (
              <>
                <PasswordInput label="Current password" name="current_password" value={passwordData.current_password} onChange={handlePasswordChange} required />
                <PasswordInput label="New password" name="new_password" value={passwordData.new_password} onChange={handlePasswordChange} required />
                <PasswordInput label="Confirm password" name="confirm_password" value={passwordData.confirm_password} onChange={handlePasswordChange} required />
                <Button type="submit" loading={loading}>Update password</Button>
                <button type="button" className="link-btn" onClick={() => setEditing({ ...editing, password: false })}>Cancel</button>
              </>
            )}
          </form>
        </div>
      </main>
    </div>
  );
};

export default Profile;
