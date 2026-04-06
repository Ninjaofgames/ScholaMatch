import React, { useEffect, useState } from "react";
import './modelStyle.css';
import './profileStyle.css';
import axios from "axios";
import FooterComp from "../components/footer";
import { data } from "react-router-dom";
import {Pie, PieChart, Cell, Tooltip, Legend, ResponsiveContainer} from 'recharts';
import { useAdminAuth } from "../context/AdminAuthContext";

export default function Profile(){
    const { admin, refreshAdmin } = useAdminAuth();
    useEffect(() => {
        document.title = "ScholaMatch - Profile"
    }, []);
    const [isEditing, setIsEditing] = useState(false);
    const [showPasswordForm, setShowPasswordForm] = useState(false);
    const [formData, setFormData] = useState({
        prenom: '',
        nom: '',
        email: '',
        phone: '',
    });
    const [passwordData, setPasswordData] = useState({
        current_password: '',
        new_password: '',
        confirm_password: '',
    });
    const [saveLoading, setSaveLoading] = useState(false);
    const [passwordLoading, setPasswordLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [passwordError, setPasswordError] = useState('');
    useEffect(() => {
        if (admin) {
            setFormData({
                prenom: admin.prenom || '',
                nom: admin.nom || '',
                email: admin.email || '',
                phone: admin.phone || '',
            });
        }
    }, [admin]);
    const handleSave = async () => {
        setSaveLoading(true);
        setMessage('');
        try {
            await axios.put('http://127.0.0.1:8000/api/auth/update-profile/', formData, {
                headers: { Authorization: `Token ${sessionStorage.getItem('scholamatch_admin_token')}` }
            });
            await refreshAdmin();
            setMessage('Profile updated successfully!');
            setIsEditing(false);
        } catch (err) {
            setMessage('Failed to update profile!');
        } finally {
            setSaveLoading(false);
        }
    };
    const handlePasswordChange = async () => {
        setPasswordError('');
        if (passwordData.new_password !== passwordData.confirm_password) {
            setPasswordError('Passwords do not match');
        }
        if (passwordData.new_password.length < 8) {
            setPasswordError('Password must be at least 8 characters');
            return;
        }
        setPasswordLoading(true);
        try {
            await axios.put('http://127.0.0.1:8000/api/auth/change-password/', passwordData, {
                headers: { Authorization: `Token ${sessionStorage.getItem('scholamatch_admin_token')}` }
            });
            setShowPasswordForm(false);
            setPasswordData({ current_password: '', new_password: '', confirm_password: '' });
            setMessage('Password changed successfully!');
        } catch (err) {
            setPasswordError(err.response?.data?.detail || 'Failed to change password');
        } finally {
            setPasswordLoading(false);
        }
    };
    const dataPie = [
        { name: "Added", value: 34 },
        { name: "Modified", value: 18 },
        { name: "Deleted", value: 7 },
    ];
    const colors = ["#4bb84b", "#5FC3DC", "#FF0000"];
    return(
        <div className="profileMain">
            <h1 className="title">Profile</h1>
            <div className="center">
                <div className="manAdd">
                    <h3 className="h3">Account informations</h3>
                    <div style={{display: 'flex', flexDirection: 'row'}}>
                        <div className="avatarSection">
                            <div className="avatar">
                                <i className="fa-solid fa-user"></i>
                            </div>
                        </div>
                        <div className="initInfo">    
                            <h2 className="username">{admin?.prenom} {admin?.nom}</h2>
                            <h3 className="admin"><span className="role" style={{textTransform: "uppercase"}}>{admin?.role}</span> • <span className="activityA" style={{color: '#4BB84B'}}>Active</span></h3>
                        </div>
                    </div>
                </div>
                {message && <div className="alert alert-success">{message}</div>}
                <div className="manAdd">
                    <h3 className="h3">Personal information</h3>
                    <div style={{display: "flex", justifyContent: "center", flexDirection:"column", gap: "10px"}}>
                        <div className="pinfo">
                            <div>
                                <label>First name</label>
                                <input type="text" 
                                readOnly={!isEditing} 
                                value={formData.prenom}
                                onChange={(e) => setFormData({...formData, prenom: e.target.value})}
                                style={{opacity: isEditing ? 1 : 0.7}}/>
                            </div>
                            <div>
                                <label>Last name</label>
                                <input type="text" 
                                readOnly={!isEditing} 
                                value={formData.nom}
                                onChange={(e) => setFormData({...formData, nom: e.target.value})}
                                style={{opacity: isEditing ? 1 : 0.7}}/>
                            </div>
                        </div>
                        <div className="pinfo">
                            <div>
                                <label>Email</label>
                                <input type="text" 
                                readOnly={!isEditing} 
                                value={formData.email}
                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                                style={{opacity: isEditing ? 1 : 0.7}}/>
                            </div>
                            <div>
                                <label>Phone number</label>
                                <input type="text" 
                                readOnly={!isEditing} 
                                value={formData.phone}
                                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                style={{opacity: isEditing ? 1 : 0.7}}/>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="manAdd">
                    <h3 className="h3">Settings</h3>
                    {!isEditing ? (
                        <button style={{width:"100%"}} onClick={() => setIsEditing(true)}>Edit profile</button>
                    ) : (
                        <div style={{display: 'flex', gap: '10px'}}>
                            <button style={{flex: 1}} onClick={handleSave} disabled={saveLoading}>
                                {saveLoading ? 'Saving...' : 'Save changes'}
                            </button>
                            <button style={{flex: 1, backgroundColor: '#555'}} onClick={() => setIsEditing(false)}>
                                Cancel
                            </button>
                        </div>
                    )}
                    <button
                        style={{width: "100%", backgroundColor: "#FF0000", marginTop: "10px"}}
                        onClick={() => setShowPasswordForm(!showPasswordForm)}
                    >
                        {showPasswordForm ? 'Cancel' : 'Change password'}
                    </button>
                    <div className={`passwordForm ${showPasswordForm ? 'open' : 'closed'}`} style={{marginTop: "15px", display: "flex", flexDirection: "column", gap: "10px"}}>
                        {passwordError && <div className="alert alert-error">{passwordError}</div>}
                        <div>
                            <label>Current password</label>
                            <input
                                type="password"
                                value={passwordData.current_password}
                                onChange={(e) => setPasswordData({...passwordData, current_password: e.target.value})}
                                placeholder="••••••••"
                            />
                        </div>
                        <div>
                            <label>New password</label>
                            <input
                                type="password"
                                value={passwordData.new_password}
                                onChange={(e) => setPasswordData({...passwordData, new_password: e.target.value})}
                                placeholder="Min 8 characters"
                            />
                        </div>
                        <div>
                            <label>Confirm new password</label>
                            <input
                                type="password"
                                value={passwordData.confirm_password}
                                onChange={(e) => setPasswordData({...passwordData, confirm_password: e.target.value})}
                                placeholder="••••••••"
                            />
                        </div>
                        <button onClick={handlePasswordChange} disabled={passwordLoading}>
                            {passwordLoading ? 'Changing...' : 'Confirm change'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}