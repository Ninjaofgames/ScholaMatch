import React, { useState, useEffect } from "react";
import './styleComponents.css';
import { data } from "react-router-dom";
import axios from "axios";

export default function Model(){
    const [file, setFile] = useState(null);
    const handleFile = async (f) => {
        if (f && f.name.endsWith('.csv')) {
            setFile(f);
            const formData = new FormData();
            formData.append('file', f);

            const response = await axios.post('http://127.0.0.1:8000/upload/', formData);
            console.log(response.data);
        }
    }
    const handleDrop = (e) => {
        e.preventDefault();
        handleFile(e.dataTransfer.files[0]);
    }
    const [items, setItems] = useState([]);
    useEffect(() => {
        axios.get("http://127.0.0.1:8000/api/test/")
        .then(res => console.log(res.data))
        .catch(err => console.log("Connection failed!", err));
    }, []);
    return(
        <div className="modelMain">
            <h1 className="title">Model training</h1>
            <div className="center">
                <div className="dropArea" onDrop={handleDrop} onDragOver={(e) => e.preventDefault()}>
                    <h3>Add a csv file</h3>
                    <div className="otherDrop">
                        <i className="fa-solid fa-download"></i><br />
                        <button className="uploadBtn" onClick={() => document.getElementById('csvInput').click()}>UPLOAD</button>
                        <input id="csvInput" type="file" accept=".csv" style={{display: "none"}} onChange={(e) => handleFile(e.target.files[0])} />
                        <p>{file ? `✓ ${file.name}` : "Drop your file here, or click to browse"}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}