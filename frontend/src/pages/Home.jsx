import React from "react";
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

export default function Home(){
    //Pie chart params
    const sentimentDistribution = [
        { name: "Positive", value: 65 },
        { name: "Neutral", value: 20 },
        { name: "Negative", value: 15 },
    ];
    const COLORS = ["#4bb84b", "#5FC3DC", "#FF6B6B"];
    //Bar chart params
    const aspectsData = [
        { aspect: "Infrastructure", positive: 45, neutral: 25, negative: 19 },
        { aspect: "Teaching Quality", positive: 89, neutral: 30, negative: 15 },
        { aspect: "Administration", positive: 30, neutral: 20, negative: 17 },
        { aspect: "Environment", positive: 70, neutral: 25, negative: 17 },
        { aspect: "Price", positive: 20, neutral: 15, negative: 10 },
        { aspect: "Location", positive: 40, neutral: 22, negative: 16 },
    ];
    //Line chart: users over time params
    const usersOverTime = [
        { date: "Jan", users: 12 },
        { date: "Feb", users: 19 },
        { date: "Mar", users: 25 },
        { date: "Apr", users: 31 },
        { date: "May", users: 28 },
        { date: "Jun", users: 42 },
        { date: "Jul", users: 55 },
        { date: "Aug", users: 48 },
        { date: "Sep", users: 63 },
        { date: "Oct", users: 71 },
        { date: "Nov", users: 68 },
        { date: "Dec", users: 89 },
    ];
    //Line chart: Comments during week params
    const commentsActivity = [
        { date: "Mon", comments: 20 },
        { date: "Tue", comments: 35 },
        { date: "Wed", comments: 28 },
        { date: "Thu", comments: 52 },
        { date: "Fri", comments: 41 },
        { date: "Sat", comments: 63 },
        { date: "Sun", comments: 48 },
    ];
    //Word Cloud params
    const words = [
        { text: "Infrastructure", size: 89 },
        { text: "Teaching", size: 134 },
        { text: "Administration", size: 67 },
        { text: "Environment", size: 112 },
        { text: "Price", size: 45 },
        { text: "Location", size: 78 },
        { text: "Staff", size: 95 },
        { text: "Cleanliness", size: 55 },
    ];
    const COLORS_CLOUD = ["#4bb84b", "#5FC3DC", "#FF6B6B", "white"];
    const svgRef = useRef(null);
    useEffect(() => {
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
        }, []);
        useEffect(() => {
            document.title = "ScholaMatch - Dashboard"
        }, []);
    return(
        <div className="profileMain">
            <h1 className="title">Dashboard</h1>
            <div className="center">
                <div className="manAdd">
                    <h3 className="h3">Platform Overview</h3>
                    <div className="mainStats">
                        <div className="oneStat">
                            <i class="fa-solid fa-user"></i>
                            <h4 className="statTitle"><b>Total users:</b> 3</h4>
                        </div>
                        <div className="oneStat">
                            <i class="fa-solid fa-school"></i>
                            <h4 className="statTitle"><b>Total schools:</b> 3</h4>
                        </div>
                        <div className="oneStat">
                            <i class="fa-solid fa-comment"></i>
                            <h4 className="statTitle"><b>Total comments:</b> 3</h4>
                        </div>
                        <div className="oneStat">
                            <i class="fa-solid fa-flask"></i>
                            <h4 className="statTitle"><b>Total tests taken:</b> 3</h4>
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