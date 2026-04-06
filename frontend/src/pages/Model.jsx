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

    //CSV Import
    const [csvFile, setCsvFile] = useState(null);
    const [csvLoading, setCsvLoading] = useState(false);
    const [csvResult, setCsvResult] = useState(null);
    const [isDragOver, setIsDragOver] = useState(false);
    const handleCsvUpload = async () => {
        if (!csvFile) return;
        setCsvLoading(true);
        setCsvResult(null);
        try {
            const formData = new FormData();
            formData.append('file', csvFile);
            const res = await axios.post('http://127.0.0.1:8000/api/comments/upload-csv/', formData);
            setCsvResult(res.data);
        } catch (err) {
            setCsvResult({ error: 'Upload failed' });
        } finally {
            setCsvLoading(false);
        }
    };
    const formatFileSize = (bytes) => {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / 1048576).toFixed(1) + ' MB';
    };
    const clearFile = () => {
        setCsvFile(null);
        setCsvResult(null);
    };
    const downloadTemplate = () => {
        const csv = 'comment_content,school_name,aspect1_name,aspect1_polarity,aspect2_name,aspect2_polarity\n"Great school","Test School","teachers","positive","location","neutral"';
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'comments_template.csv';
        a.click();
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://127.0.0.1:8000/api/comments/", {
                comment_content: comment,
                aspects: aspects,
                school_id: selectedSchool?.id,
                data_source: "manual"
            });
            setComment("");
            setAspects([{ aspect: '', polarity: 'positive' }]);
            setSelectedSchool(null);
            setSchoolQuery('');
            alert("Comment submitted successfully!");
        } catch (error) {
            console.log("Error details:", error.response?.data);
            alert("Error submitting comment: " + (error.response?.data?.error || "Unknown error"));
        }
    }
    useEffect(() => {
        document.title = "ScholaMatch - Comments"
    }, []);
    return(
        <div className="modelMain">
            <h1 className="title">Add comments</h1>
            <div className="center">
                <h2 className="modelName">ScholaSense®</h2>
                <div className="manAdd bulk-import-card">
                    <div className="bulk-import-header">
                        <div className="bulk-import-icon-wrap">
                            <i className="fa-solid fa-cloud-arrow-up"></i>
                        </div>
                        <div>
                            <h3 className="h3">Bulk Import</h3>
                            <p className="bulk-import-desc">Import multiple comments at once via CSV file</p>
                        </div>
                    </div>

                    <div
                        className={`dropArea${isDragOver ? ' drag-over' : ''}${csvFile ? ' has-file' : ''}`}
                        onDrop={(e) => { e.preventDefault(); setIsDragOver(false); const f = e.dataTransfer.files[0]; if (f && f.name.endsWith('.csv')) setCsvFile(f); }}
                        onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                        onDragLeave={() => setIsDragOver(false)}
                        onClick={() => !csvFile && document.getElementById('csvComments').click()}
                    >
                        <input id="csvComments" type="file" accept=".csv" style={{display: 'none'}} onChange={(e) => { setCsvFile(e.target.files[0]); setCsvResult(null); }} />
                        {!csvFile ? (
                            <div className="otherDrop">
                                <div className="drop-icon-circle">
                                    <i className="fa-solid fa-file-csv"></i>
                                </div>
                                <p className="drop-main-text">Drag & drop your CSV file here</p>
                                <p className="drop-sub-text">or <span className="browse-link">browse files</span></p>
                                <div className="drop-formats">
                                    <span className="format-badge">.CSV</span>
                                </div>
                            </div>
                        ) : (
                            <div className="file-info">
                                <div className="file-info-left">
                                    <div className="file-icon-wrap">
                                        <i className="fa-solid fa-file-csv"></i>
                                    </div>
                                    <div className="file-details">
                                        <span className="file-name">{csvFile.name}</span>
                                        <span className="file-size">{formatFileSize(csvFile.size)}</span>
                                    </div>
                                </div>
                                <button className="file-remove-btn" type="button" onClick={(e) => { e.stopPropagation(); clearFile(); }}>
                                    <i className="fa-solid fa-xmark"></i>
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="bulk-import-actions">
                        <button type="button" className="template-btn" onClick={downloadTemplate}>
                            <i className="fa-solid fa-download"></i>
                            Download CSV Template
                        </button>
                        {csvFile && (
                            <button type="button" className="submit-csv-btn" onClick={handleCsvUpload} disabled={csvLoading}>
                                {csvLoading ? (
                                    <><i className="fa-solid fa-spinner fa-spin"></i> Uploading...</>
                                ) : (
                                    <><i className="fa-solid fa-paper-plane"></i> Submit CSV</>
                                )}
                            </button>
                        )}
                    </div>

                    {csvResult && (
                        <div className={`csv-alert ${csvResult.error ? 'csv-alert-error' : (csvResult.saved === 0 ? 'csv-alert-error' : 'csv-alert-success')}`}>
                            <div className="csv-alert-icon">
                                <i className={`fa-solid ${csvResult.error || csvResult.saved === 0 ? 'fa-circle-exclamation' : 'fa-circle-check'}`}></i>
                            </div>
                            <div className="csv-alert-content">
                                <span className="csv-alert-title">
                                    {csvResult.error ? 'Upload Failed' : (csvResult.saved === 0 ? 'No Comments Saved' : 'Upload Successful!')}
                                </span>
                                <span className="csv-alert-detail">
                                    {csvResult.error || `${csvResult.saved} comments saved${csvResult.errors?.length > 0 ? ` · ${csvResult.errors.length} errors` : ''}`}
                                </span>
                                {csvResult.errors?.length > 0 && (
                                    <div className="csv-error-list">
                                        {csvResult.errors.slice(0, 3).map((err, i) => (
                                            <span key={i} className="csv-error-item">• {err}</span>
                                        ))}
                                        {csvResult.errors.length > 3 && (
                                            <span className="csv-error-item">... and {csvResult.errors.length - 3} more</span>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
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