import React, { useState } from "react";
import { useEffect, useRef } from "react";
import './modelStyle.css';
import './homestyle.css';
import axios from "axios";
import FooterComp from "../components/footer";
import { data } from "react-router-dom";
import {
    PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
    BarChart, Bar, XAxis, YAxis, CartesianGrid,
    LineChart, Line
} from "recharts";
import cloud from "d3-cloud";
import { useAdminAuth } from "../context/AdminAuthContext";

const API_BASE_URL = 'http://127.0.0.1:8000/api';

export default function Home(){
    const COLORS = ["#4bb84b", "#5FC3DC", "#FF6B6B"];
    const COLORS_CLOUD = ["#4bb84b", "#5FC3DC", "#FF6B6B", "white"];
    const svgRef = useRef(null);
        useEffect(() => {
            document.title = "ScholaMatch - Dashboard"
        }, []);
        const { admin } = useAdminAuth();
        const [stats, setStats] = useState({ users: 0, schools: 0, comments: 0, tests:0});
        useEffect(() => {
            axios.get(`${API_BASE_URL}/stats/`)
            .then(res => setStats(res.data));
        }, [])
        const [sentimentDistribution, setSentiment] = useState([]);
        const [aspectsData, setAspects] = useState([]);
        const [commentsActivity, setComments] = useState([]);
        const [usersOverTime, setUsersOverTime] = useState([]);
        const [words, setWords] = useState([]);
        //Word cloud settings
        useEffect(() => {
            if (words.length === 0) return;
            cloud()
                .size([500, 300])
                .words(words.map(w => ({ ...w })))
                .padding(5)
                .rotate(0)
                .fontSize((d) => d.size / 2)
                .on("end", (output) => {
                    const svg = svgRef.current;
                    if (!svg) return;
                    svg.innerHTML = "";
                    output.forEach((word) => {
                        const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
                        text.setAttribute("transform", `translate(${word.x + 250}, ${word.y + 150})`);
                        text.setAttribute("font-size", `${word.size}px`);
                        text.setAttribute("fill", COLORS[Math.floor(Math.random() * COLORS.length)]);
                        text.setAttribute("text-anchor", "middle");
                        text.setAttribute("font-family", "sans-serif");
                        text.textContent = word.text;
                        svg.appendChild(text);
                    });
                })
                .start();
        }, [words]);

        useEffect(() => {
            axios.get(`${API_BASE_URL}/stats/sentiment/`).then(res => setSentiment(res.data));
            axios.get(`${API_BASE_URL}/stats/aspects/`).then(res => setAspects(res.data));
            axios.get(`${API_BASE_URL}/stats/comments-week/`).then(res => setComments(res.data));
            axios.get(`${API_BASE_URL}/stats/keywords/`).then(res => setWords(res.data));
            axios.get(`${API_BASE_URL}/stats/users-growth/`).then(res => setUsersOverTime(res.data));
        }, []);
    return(
        <div className="profileMain">
            <h1 className="title">Dashboard</h1>
            <h2 className="subtitle" style={{color: "white"}}>Hello again, {admin?.prenom} {admin?.nom}</h2>
            <div className="center">
                <div className="manAdd">
                    <h3 className="h3">Platform Overview</h3>
                    <div className="mainStats">
                        <div className="oneStat">
                            <i class="fa-solid fa-user"></i>
                            <h4 className="statTitle"><b>Total users:</b> {stats.users}</h4>
                        </div>
                        <div className="oneStat">
                            <i class="fa-solid fa-school"></i>
                            <h4 className="statTitle"><b>Total schools:</b> {stats.schools}</h4>
                        </div>
                        <div className="oneStat">
                            <i class="fa-solid fa-comment"></i>
                            <h4 className="statTitle"><b>Total comments:</b> {stats.comments}</h4>
                        </div>
                        <div className="oneStat">
                            <i class="fa-solid fa-flask"></i>
                            <h4 className="statTitle"><b>Total tests taken:</b> {stats.tests}</h4>
                        </div>
                    </div>
                </div>
                <div className="twoStats">
                    <div className="manAdd">
                        <h3 className="h3">Sentiment analysis</h3>
                        <ResponsiveContainer width="100%" height={350}>
                            <PieChart>
                                <Pie
                                    data={sentimentDistribution}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={70}
                                    outerRadius={110}
                                    paddingAngle={5}
                                    dataKey="value"
                                    label={({name, percent}) => `${name} ${(percent*100).toFixed(0)}%`}
                                    labelLine={true}
                                    >
                                    {sentimentDistribution.map((entry, index) => (
                                        <Cell key={index} fill={COLORS[index]} />
                                    ))}
                                </Pie>
                                <Tooltip 
                                contentStyle={{
                                    background: "rgba(15,25,35,0.9)",
                                    border: "1px solid #4bb84b",
                                    borderRadius: "8px",
                                    color: "white"
                                 }}
                                itemStyle={{
                                    color: "#4bb84b"
                                }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="manAdd">
                        <h3 className="h3">Top aspects</h3>
                        <ResponsiveContainer width="100%" height={350}>
                            <BarChart data={aspectsData} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                                <XAxis type="number" tick={{ fill: "white", fontSize: 11 }} />
                                <YAxis
                                    dataKey="aspect"
                                    type="category"
                                    tick={{ fill: "white", fontSize: 14 }}
                                    width={120}
                                />
                                <Tooltip
                                    contentStyle={{
                                        background: "rgba(15,25,35,0.9)",
                                        border: "1px solid #4bb84b",
                                        borderRadius: "8px",
                                        color: "white"
                                    }}
                                    formatter={(value, name) => [`${value} comments`, name]}
                                />
                                <Legend formatter={(value) => <span style={{ color: "white" }}>{value}</span>} />
                                <Bar dataKey="positive" name="Positive" fill="#4BB84B" radius={[0, 4, 4, 0]} />
                                <Bar dataKey="neutral" name="Neutral" fill="#5FC3DC" radius={[0, 4, 4, 0]} />
                                <Bar dataKey="negative" name="Negative" fill="#FF6B6B" radius={[0, 4, 4, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
                <div className="twoStats">
                    <div className="manAdd">
                        <h3 className="h3">Most discussed keywords</h3>
                        <svg ref={svgRef} width="100%" height="300" viewBox="0 0 500 300" />
                    </div>
                    <div className="manAdd">
                        <h3 className="h3">Comments activity per week</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={commentsActivity}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                                <XAxis dataKey="date" tick={{ fill: "white" }} />
                                <YAxis tick={{ fill: "white" }} />
                                <Tooltip
                                    contentStyle={{
                                        background: "rgba(15,25,35,0.9)",
                                        border: "1px solid #4bb84b",
                                        borderRadius: "8px",
                                        color: "white"
                                    }}
                                    formatter={(value) => [`${value} comments`]}
                                    itemStyle={{
                                        color: "#4bb84b"
                                    }}
                                />
                                <Bar dataKey="comments" radius={[6, 6, 0, 0]}>
                                    {commentsActivity.map((entry, index) => (
                                        <Cell
                                            key={index}
                                            fill={entry.comments >= 70 ? "#4bb84b" : entry.comments >= 40 ? "#5FC3DC" : "#FF6B6B"}
                                        />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
                <div className="manAdd">
                    <h3 className="h3">User growth over time</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={usersOverTime}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                            <XAxis dataKey="date" tick={{fill: "white"}} />
                            <YAxis tick={{fill: "white"}} />
                            <Tooltip
                                contentStyle={{
                                    background: "rgba(15,25,35,0.9)",
                                    border: "1px solid #4bb84b",
                                    borderRadius: "8px",
                                    color: "white"
                                }}
                                formatter={(value) => [`${value} users`]}
                            />
                            <Line
                                type="monotone"
                                dataKey="users"
                                stroke="#4bb84b"
                                strokeWidth={2}
                                dot={{ fill: "#4bb84b", r: 4 }}
                                activeDot={{ r: 6 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}