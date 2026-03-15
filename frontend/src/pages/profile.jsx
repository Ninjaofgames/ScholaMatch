import React, { useEffect, useState } from "react";
import './modelStyle.css';
import './profileStyle.css';
import axios from "axios";
import FooterComp from "../components/footer";
import { data } from "react-router-dom";
import {Pie, PieChart, Cell, Tooltip, Legend, ResponsiveContainer} from 'recharts';
import { useAdminAuth } from "../context/AdminAuthContext";

export default function Profile(){
    const { admin } = useAdminAuth();
    useEffect(() => {
        document.title = "ScholaMatch - Profile"
    }, []);
    const [isEditing, setIsEditing] = useState(false);
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
                            <h3 className="admin"><b>Last login:</b> 3-3-2026</h3>
                        </div>
                    </div>
                </div>
                <div className="manAdd">
                    <h3 className="h3">Personal information</h3>
                    <div style={{display: "flex", justifyContent: "center", flexDirection:"column", gap: "10px"}}>
                        <div className="pinfo">
                            <div>
                                <label>First name</label>
                                <input type="text" readOnly value={admin?.prenom || ''}/>
                            </div>
                            <div>
                                <label>Last name</label>
                                <input type="text" readOnly value={admin?.nom || ''}/>
                            </div>
                        </div>
                        <div className="pinfo">
                            <div>
                                <label>Email</label>
                                <input type="text" readOnly value={admin?.email || ''}/>
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
                                        background: "rgba(95, 195, 220, 0.5)",
                                        border: "1px solid #4bb84b",
                                        borderRadius: "8px",
                                        color: "white"
                                    }}
                                />
                                <Legend
                                    formatter={(value) => (
                                        <span style={{color: "white"}}>{value}</span>
                                    )}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
                <div className="manAdd">
                    <h3 className="h3">Settings</h3>
                    <button style={{width:"100%"}}>Edit profile</button>
                    <button style={{width: "100%", backgroundColor: "#FF0000"}}>Change password</button>
                </div>
            </div>
        </div>
    );
}