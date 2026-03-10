import React, { useState } from "react";
import './modelStyle.css';
import './profileStyle.css';
import axios from "axios";
import FooterComp from "../components/footer";
import { data } from "react-router-dom";
import {Pie, PieChart, Cell, Tooltip, Legend, ResponsiveContainer} from 'recharts';

export default function Profile(){
    const [isEditing, setIsEditing] = useState(false);
    const dataPie = [
        { name: "Added", value: 34 },
        { name: "Modified", value: 18 },
        { name: "Deleted", value: 7 },
    ];
    // Replaced #4bb84b w/ theme accent, #5FC3DC w/ theme highlight, #FF0000 w/ theme danger
    const colors = ["#0ea5e9", "#8b5cf6", "#ef4444"];
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
                            <h2 className="username" style={{color: "var(--text-primary)"}}>Manga dev.</h2>
                            <h3 className="admin"><span className="role">Admin</span> • <span className="activityA" style={{color: 'var(--accent-blue)'}}>Active</span></h3>
                            <h3 className="admin" style={{color: 'var(--text-muted)'}}><b>Last login:</b> 3-3-2026</h3>
                        </div>
                    </div>
                </div>
                <div className="manAdd">
                    <h3 className="h3">Personal information</h3>
                    <div style={{display: "flex", justifyContent: "center", flexDirection:"column", gap: "10px"}}>
                        <div className="pinfo">
                            <div>
                                <label>First name</label>
                                <input type="text" readOnly value={"Manga"}/>
                            </div>
                            <div>
                                <label>Last name</label>
                                <input type="text" readOnly value={"dev."}/>
                            </div>
                        </div>
                        <div className="pinfo">
                            <div>
                                <label>Email</label>
                                <input type="text" readOnly value={"mangadev@example.com"}/>
                            </div>
                            <div>
                                <label>Phone number</label>
                                <input type="text" readOnly value={"+212 600 000 000"}/>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="manAdd">
                    <h3 className="h3">Activity</h3>
                    <div style={{display: "flex", justifyContent: "center", flexDirection:"column", gap: "10px"}}>
                        <div className="pinfo">
                            <div>
                                <label>Total counts</label>
                                <input type="number" readOnly value={0}/>
                            </div>
                            <div>
                                <label>Total schools managed</label>
                                <input type="number" readOnly value={0}/>
                            </div>
                        </div>
                        <div className="pinfo">
                            <div>
                                <label>Total CSV files uploaded</label>
                                <input type="number" readOnly value={0}/>
                            </div>
                        </div>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                data={dataPie}
                                cx="50%"
                                cy="50%"
                                innerRadius={70}
                                outerRadius={110}
                                paddingAngle={5}
                                dataKey="value">
                                    {dataPie.map((entry, index) => (
                                        <Cell key={index} fill={colors[index]} />
                                    ))}
                                </Pie>
                                <Tooltip 
                                    contentStyle={{
                                        background: "var(--bg-glass)",
                                        border: "1px solid var(--border-glass)",
                                        borderRadius: "12px",
                                        color: "var(--text-primary)",
                                        backdropFilter: "blur(10px)"
                                    }}
                                />
                                <Legend
                                    formatter={(value) => (
                                        <span style={{color: "var(--text-secondary)"}}>{value}</span>
                                    )}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
                <div className="manAdd">
                    <h3 className="h3">Settings</h3>
                    <button style={{width:"100%", marginBottom: "15px"}}>Edit profile</button>
                    <button style={{width: "100%", background: "linear-gradient(135deg, #ef4444, #dc2626)", boxShadow: "0 4px 12px rgba(239, 68, 68, 0.3)"}}>Change password</button>
                </div>
            </div>
        </div>
    );
}