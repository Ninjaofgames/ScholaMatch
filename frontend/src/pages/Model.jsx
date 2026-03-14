import React, { useState, useEffect } from "react";
import './modelStyle.css';
import { data } from "react-router-dom";
import axios from "axios";
import FooterComp from "../components/footer";

export default function Model(){
    //Form section
    const [comment, setComment] = useState("");
    //Extendable list
    const [aspects, setAspects] = useState([{ aspect: '', polarity: 'positive'}]);
    const addAspect = () => setAspects([...aspects, { aspect: '', polarity: 'positive' }]);
    const removeAspect = (index) => setAspects(aspects.filter((_, i) => i !== index));
    const handleAspectChange = (index, field, value) => {
        const updated = [...aspects];
        updated[index][field] = value;
        setAspects(updated);
    }

    //School Search
    const [schoolQuery, setSchoolQuery] = useState('');
    const [schoolResults, setSchoolResults] = useState([]);
    const [selectedSchool, setSelectedSchool] = useState(null);
    const handleSchoolSearch = (e) => {
        setSchoolQuery(e.target.value);
        setSelectedSchool(null);
    };
    useEffect(() => {
        if (schoolQuery.length < 2) {
            setSchoolResults([]);
            return;
        }
        const fetchSchools = async () => {
            const res = await axios.get(`http://127.0.0.1:8000/api/schools/search/?q=${schoolQuery}`);
            setSchoolResults(res.data);
        }
        fetchSchools();
    }, [schoolQuery]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://127.0.0.1:8000/api/comments/", {
                comment_content: comment,
                aspects: aspects,
                data_source: "manual"
            });
            setComment("");
            setAspects([{ aspect: '', polarity: 'positive' }]);
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
    useEffect(() => {
        document.title = "ScholaMatch - Comments"
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
                        <div className="formGroup school-search-container">
                            <label>School name</label>
                            <input
                                type="text"
                                placeholder="Search school..."
                                value={schoolQuery}
                                onChange={handleSchoolSearch}
                                className="school-search-input"
                            />
                            {schoolResults.length > 0 && (
                                <div className="school-results-dropdown">
                                    {schoolResults.map(school => (
                                        <div 
                                            key={school.id} 
                                            className="school-result-item"
                                            onClick={() => {
                                                setSelectedSchool(school);
                                                setSchoolQuery(school.name);
                                                setSchoolResults([]);
                                            }}
                                        >
                                            <i className="fa-solid fa-school"></i>
                                            <span>{school.name}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                            {selectedSchool && !schoolResults.length && (
                                <p className="selected-school-tip">✓ Selected: {selectedSchool.name}</p>
                            )}
                        </div>
                        <div className="formGroup aspect-list">
                            <label>Aspects</label>
                            {aspects.map((item, index) => (
                                <div className="aspect-row searchBar" key={index}>
                                    <input
                                        type="text"
                                        placeholder="Aspect name"
                                        value={item.aspect}
                                        onChange={ (e) => handleAspectChange(index, 'aspect', e.target.value)}
                                        required
                                    />
                                    <select
                                        value={item.polarity}
                                        onChange={(e) => handleAspectChange(index, 'polarity', e.target.value)}
                                    >
                                        <option value="positive">Positive</option>
                                        <option value="neutral">Neutral</option>
                                        <option value="negative">Negative</option>
                                    </select>
                                    {aspects.length > 1 && (
                                        <button type="button" onClick={() => removeAspect(index)} style={{marginTop: 0, padding: "0 20px"}}>-</button>
                                    )}
                                </div>
                            ))}
                            <button type="button" onClick={addAspect} style={{marginTop: "5px"}}>+ Add Aspect</button>
                        </div>
                        <button type="submit">Submit Comment</button>
                    </form>
                </div>
            </div>
        </div>
    );
}