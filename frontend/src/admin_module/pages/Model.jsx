import React, { useState, useEffect } from "react";
import './modelStyle.css';
import { data } from "react-router-dom";
import { adminApi } from "../../services/adminAuthService";
import FooterComp from "../components/footer";

export default function Model(){
    //Form section
    const [comment, setComment] = useState("");
    const [sentiment_label, setLabel] = useState("postive");
    const [sentiment_score, setSentimentScore] = useState(0);
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await adminApi.post("http://127.0.0.1:8000/admin-api/comments/", {
                comment_content: comment,
                sentiment_label: sentiment_label,
                sentiment_score: sentiment_score,
                data_source: "manual"
            });
            setComment("");
            setLabel("postive");
            setSentimentScore(0);
            alert("Comment submitted successfully!");
        } catch (error) {
            console.log("Error details:", error.response?.data);
            alert("Error submitting comment: " + (error.response?.data?.error || error.response?.data?.comment_content || "Unknown error"));
        }
    }
    //Import section
    const [file, setFile] = useState(null);
    const handleFile = async (f) => {
        if (f && f.name.endsWith('.csv')) {
            setFile(f);
            const formData = new FormData();
            formData.append('file', f);

            const response = await adminApi.post('http://127.0.0.1:8000/upload/', formData);
            console.log(response.data);
        }
    }
    const handleDrop = (e) => {
        e.preventDefault();
        handleFile(e.dataTransfer.files[0]);
    }
    const [items, setItems] = useState([]);
    useEffect(() => {
        adminApi.get("http://127.0.0.1:8000/api/test/")
        .then(res => console.log(res.data))
        .catch(err => console.log("Connection failed!", err));
    }, []);
    return(
        <div className="modelMain">
            <h1 className="title">Add comments</h1>
            <div className="center">
                <h2 className="modelName">ScholaSense®</h2>
                <div className="dropArea" onDrop={handleDrop} onDragOver={(e) => e.preventDefault()}>
                    <h3 className="h3">Add a csv file</h3>
                    <div className="otherDrop">
                        <i className="fa-solid fa-download"></i><br />
                        <button className="uploadBtn" onClick={() => document.getElementById('csvInput').click()}>UPLOAD</button>
                        <input id="csvInput" type="file" accept=".csv" style={{display: "none"}} onChange={(e) => handleFile(e.target.files[0])} />
                        <p>{file ? `✓ ${file.name}` : "Drop your file here, or click to browse"}</p>
                    </div>
                </div>
                <h2 className="subtitle">Add manually a comment</h2>
                <div className="manAdd">
                    <h3 className="h3">Comment section</h3>
                    <form onSubmit={handleSubmit}>
                        <label>Comment</label>
                        <textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Put your comment here" required></textarea>
                        
                        <div className="formGroup">
                            <label>Sentiment</label>
                            <div className="radioGroup">
                                <label>
                                    <input type="radio" value="postive" checked={sentiment_label === "postive"} onChange={(e) => setLabel(e.target.value)} />
                                    <span className="radioLabel positive">Positive</span>
                                </label>
                                <label>
                                    <input type="radio" value="neutral" checked={sentiment_label === "neutral"} onChange={(e) => setLabel(e.target.value)} />
                                    <span className="radioLabel neutral">Neutral</span>
                                </label>
                                <label>
                                    <input type="radio" value="negative" checked={sentiment_label === "negative"} onChange={(e) => setLabel(e.target.value)} />
                                    <span className="radioLabel negative">Negative</span>
                                </label>
                            </div>
                        </div>
                        <label>Sentiment Score</label>
                        <input type="number" onChange={(e) => setSentimentScore(e.target.value)} placeholder="Formula: Score= (NPos * 1) + (NNeu * 0) + (NNeg * (-1))" step={"any"} required/>
                    </form>
                </div>
            </div>
        </div>
    );
}