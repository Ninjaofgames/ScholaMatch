import React, { useState, useEffect } from "react";
import './modelStyle.css';
import axios from "axios";

const API_BASE_URL = 'http://127.0.0.1:8000/api';

// Defined outside of SchoolManagement to avoid re-mounting on every render
function SearchDropdown({ query, onSearch, results, onSelect, selected, placeholder }) {
    return (
        <div className="formGroup school-search-container">
            <label>School name</label>
            <input
                type="text"
                placeholder={placeholder || "Search school..."}
                value={query}
                onChange={onSearch}
                className="school-search-input"
            />
            {results.length > 0 && (
                <div className="school-results-dropdown">
                    {results.map(school => (
                        <div
                            key={school.id}
                            className="school-result-item"
                            onClick={() => onSelect(school)}
                        >
                            <i className="fa-solid fa-school"></i>
                            <span>{school.name}</span>
                        </div>
                    ))}
                </div>
            )}
            {selected && !results.length && (
                <p className="selected-school-tip">✓ Selected: {selected.name}</p>
            )}
        </div>
    );
}

const emptyForm = {
    name: "", website_link: "", location: "", location_link: "",
    mail: "", phone: "", funding_type: "", education_level: "",
    teaching_language: "", teaching_language_other: "",
    university_name: "", keywords: "", image_link: "", description: "",
};

export default function SchoolManagement(){
    // ── Add Form State ──
    const [addForm, setAddForm] = useState({ ...emptyForm });

    // ── Modify Form State ──
    const [modifyForm, setModifyForm] = useState({ ...emptyForm });

    // ── Search-by-name state (modify section) ──
    const [modifyQuery, setModifyQuery] = useState("");
    const [modifyResults, setModifyResults] = useState([]);
    const [selectedModifySchool, setSelectedModifySchool] = useState(null);

    // ── Search-by-name state (delete section) ──
    const [deleteQuery, setDeleteQuery] = useState("");
    const [deleteResults, setDeleteResults] = useState([]);
    const [selectedDeleteSchool, setSelectedDeleteSchool] = useState(null);

    // ── Search handlers ──
    const handleModifySearch = async (e) => {
        const q = e.target.value;
        setModifyQuery(q);
        setSelectedModifySchool(null);
        if (q.length < 2) { setModifyResults([]); return; }
        try {
            const res = await axios.get(`${API_BASE_URL}/schools/search/?q=${encodeURIComponent(q)}`);
            setModifyResults(res.data);
        } catch { setModifyResults([]); }
    };

    const handleDeleteSearch = async (e) => {
        const q = e.target.value;
        setDeleteQuery(q);
        setSelectedDeleteSchool(null);
        if (q.length < 2) { setDeleteResults([]); return; }
        try {
            const res = await axios.get(`${API_BASE_URL}/schools/search/?q=${encodeURIComponent(q)}`);
            setDeleteResults(res.data);
        } catch { setDeleteResults([]); }
    };

    const selectModifySchool = (school) => {
        setSelectedModifySchool(school);
        setModifyQuery(school.name);
        setModifyResults([]);
        setModifyForm({
            name: school.name || "",
            website_link: school.website_link || "",
            location: school.location || "",
            location_link: school.location_link || "",
            mail: school.mail || "",
            phone: school.phone || "",
            funding_type: school.funding_type || "",
            education_level: school.education_level || "",
            teaching_language: school.teaching_language || "",
            teaching_language_other: "",
            university_name: school.university_name || "",
            keywords: "",
            image_link: school.image || "",
            description: school.description || "",
        });
    };

    const selectDeleteSchool = (school) => {
        setSelectedDeleteSchool(school);
        setDeleteQuery(school.name);
        setDeleteResults([]);
    };

    // ── Handlers ──

    const handleAddSubmit = async () => {
        try {
            const data = { ...addForm };
            if (data.teaching_language === 'other') {
                data.teaching_language_other = data.teaching_language_other;
            }
            data.image = data.image_link;
            delete data.image_link;
            await axios.post(`${API_BASE_URL}/schools/create/`, data);
            alert("School added successfully!");
            setAddForm({ ...emptyForm });
        } catch (error) {
            alert("Error adding school: " + (error.response?.data?.error || "Unknown error"));
        }
    };

    const handleModifySubmit = async () => {
        if (!selectedModifySchool) {
            alert("Please search and select a school first.");
            return;
        }
        try {
            const data = { ...modifyForm };
            data.image = data.image_link;
            delete data.image_link;
            await axios.put(`${API_BASE_URL}/schools/${selectedModifySchool.id}/update/`, data);
            alert("School updated successfully!");
        } catch (error) {
            alert("Error updating school: " + (error.response?.data?.error || "Unknown error"));
        }
    };

    const handleDeleteSubmit = async () => {
        if (!selectedDeleteSchool) {
            alert("Please search and select a school first.");
            return;
        }
        if (!window.confirm(`Are you sure you want to delete "${selectedDeleteSchool.name}"?`)) return;
        try {
            await axios.delete(`${API_BASE_URL}/schools/${selectedDeleteSchool.id}/delete/`);
            alert("School deleted successfully!");
            setDeleteQuery("");
            setSelectedDeleteSchool(null);
        } catch (error) {
            alert("Error deleting school: " + (error.response?.data?.error || "Unknown error"));
        }
    };

    useEffect(() => {
        document.title = "ScholaMatch - School Management"
    }, []);


    return (
        <div className="modelMain">
            <h1 className="title">School Management</h1>
            <div className="center">
                <h2 className="subtitle">Add a new school</h2>
                <div className="manAdd">
                    <div className="schoolSection">
                        <h3 className="h3">School information</h3>
                        <div className="formGroup">
                            <label>Image link</label>
                            <input type="text" placeholder="Paste an image URL (e.g. https://...)" value={addForm.image_link} onChange={(e) => setAddForm({ ...addForm, image_link: e.target.value })} />
                        </div>
                        <form onSubmit={(e) => { e.preventDefault(); handleAddSubmit(); }}>
                            <div className="formRow">
                                <div className="formGroup">
                                    <label>Name</label>
                                    <input type="text" value={addForm.name} onChange={(e) => setAddForm({ ...addForm, name: e.target.value })} required />
                                </div>
                                <div className="formGroup">
                                    <label>Website link</label>
                                    <input type="text" value={addForm.website_link} onChange={(e) => setAddForm({ ...addForm, website_link: e.target.value })} />
                                </div>
                            </div>
                            <div className="formRow">
                                <div className="formGroup">
                                    <label>Location</label>
                                    <input type="text" value={addForm.location} onChange={(e) => setAddForm({ ...addForm, location: e.target.value })} />
                                </div>
                                <div className="formGroup">
                                    <label>Location link</label>
                                    <input type="text" value={addForm.location_link} onChange={(e) => setAddForm({ ...addForm, location_link: e.target.value })} />
                                </div>
                            </div>
                            <div className="formRow">
                                <div className="formGroup">
                                    <label>Mail</label>
                                    <input type="text" value={addForm.mail} onChange={(e) => setAddForm({ ...addForm, mail: e.target.value })} />
                                </div>
                                <div className="formGroup">
                                    <label>Phone</label>
                                    <input type="text" value={addForm.phone} onChange={(e) => setAddForm({ ...addForm, phone: e.target.value })} />
                                </div>
                            </div>
                            <div className="formGroup">
                                <label>Description</label>
                                <textarea
                                    value={addForm.description}
                                    onChange={(e) => setAddForm({ ...addForm, description: e.target.value })}
                                    placeholder="Write a description about the school..."
                                    rows={4}
                                />
                            </div>
                            <div className="formGroup">
                                <label>Funding type</label>
                                <div className="radioGroup">
                                    {["public", "private", "semi-public"].map((val) => (
                                        <label key={val}>
                                            <input
                                                type="radio"
                                                value={val}
                                                checked={addForm.funding_type === val}
                                                onChange={(e) => setAddForm({ ...addForm, funding_type: e.target.value })}
                                            />
                                            <span className="radioLabel">{val}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                            <div style={{display:"flex", flexWrap:"wrap"}}>
                                <div className="formGroup">
                                    <label>Education level</label>
                                    <div className="radioGroup">
                                        {["primary", "secondary", "high school", "college"].map((val) => (
                                            <label key={val}>
                                                <input
                                                    type="radio"
                                                    value={val}
                                                    checked={addForm.education_level === val}
                                                    onChange={(e) => setAddForm({ ...addForm, education_level: e.target.value })}
                                                />
                                                <span className="radioLabel">{val}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <div className="formGroup">
                                    <label>Teaching language</label>
                                    <div className="radioGroup">
                                        {["bilingual", "arabic", "french", "english", "other"].map((val) => (
                                            <label key={val}>
                                                <input
                                                    type="radio"
                                                    value={val}
                                                    checked={addForm.teaching_language === val}
                                                    onChange={(e) => setAddForm({ ...addForm, teaching_language: e.target.value })}
                                                />
                                                <span className="radioLabel">{val}</span>
                                            </label>
                                        ))}
                                    </div>
                                    {addForm.teaching_language === "other" && (
                                        <input
                                            type="text"
                                            placeholder="Specify language"
                                            value={addForm.teaching_language_other}
                                            onChange={(e) => setAddForm({ ...addForm, teaching_language_other: e.target.value })}
                                            style={{ marginTop: "10px" }}
                                        />
                                    )}
                                </div>
                            </div>
                            <div className="formRow">
                                <div className="formGroup">
                                    <label>University name (for college)</label>
                                    <input type="text" value={addForm.university_name} onChange={(e) => setAddForm({ ...addForm, university_name: e.target.value })} />
                                </div>
                                <div className="formGroup">
                                    <label>Keywords (max 4)</label>
                                    <input type="text" value={addForm.keywords} onChange={(e) => setAddForm({ ...addForm, keywords: e.target.value })} />
                                </div>
                            </div>
                            <p style={{ opacity: 0.7, fontSize: "14px" }}>ℹ️ Our system requires real user comments to train the model before a school can be added to the database.</p>
                            <button type="submit">Add School</button>
                        </form>
                    </div>
                </div>

                {/* ════════════════ MODIFY SCHOOL ════════════════ */}
                <h2 className="subtitle">Modify a school</h2>
                <div className="manAdd schoolSection">
                    <h3 className="h3">Search school</h3>
                    <SearchDropdown
                        query={modifyQuery}
                        onSearch={handleModifySearch}
                        results={modifyResults}
                        onSelect={selectModifySchool}
                        selected={selectedModifySchool}
                        placeholder="Search school to modify..."
                    />

                    {selectedModifySchool && (
                        <>
                            <h3 className="h3">School information</h3>
                            <div className="formGroup">
                                <label>Image link</label>
                                <input type="text" placeholder="Paste an image URL (e.g. https://...)" value={modifyForm.image_link} onChange={(e) => setModifyForm({ ...modifyForm, image_link: e.target.value })} />
                            </div>
                            <form onSubmit={(e) => { e.preventDefault(); handleModifySubmit(); }}>
                                <div className="formRow">
                                    {["name", "website_link", "location", "location_link", "mail", "phone"].reduce((rows, field, i) => {
                                        if (i % 2 === 0) rows.push([]);
                                        rows[rows.length - 1].push(field);
                                        return rows;
                                    }, []).map((pair, idx) => (
                                        <React.Fragment key={idx}>
                                            {pair.map((field) => (
                                                <div className="formGroup" key={field}>
                                                    <label>{field.replace(/_/g, " ")}</label>
                                                    <input
                                                        type="text"
                                                        value={modifyForm[field]}
                                                        onChange={(e) => setModifyForm({ ...modifyForm, [field]: e.target.value })}
                                                    />
                                                </div>
                                            ))}
                                        </React.Fragment>
                                    ))}
                                </div>
                                <div className="formGroup">
                                    <label>Description</label>
                                    <textarea
                                        value={modifyForm.description}
                                        onChange={(e) => setModifyForm({ ...modifyForm, description: e.target.value })}
                                        placeholder="Write a description about the school..."
                                        rows={4}
                                    />
                                </div>
                                <div className="formGroup">
                                    <label>Funding type</label>
                                    <div className="radioGroup">
                                        {["public", "private", "semi-public"].map((val) => (
                                            <label key={val}>
                                                <input
                                                    type="radio"
                                                    value={val}
                                                    checked={modifyForm.funding_type === val}
                                                    onChange={(e) => setModifyForm({ ...modifyForm, funding_type: e.target.value })}
                                                />
                                                <span className="radioLabel">{val}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <div className="formGroup">
                                    <label>Education level</label>
                                    <div className="radioGroup">
                                        {["primary", "secondary", "high school", "college"].map((val) => (
                                            <label key={val}>
                                                <input
                                                    type="radio"
                                                    value={val}
                                                    checked={modifyForm.education_level === val}
                                                    onChange={(e) => setModifyForm({ ...modifyForm, education_level: e.target.value })}
                                                />
                                                <span className="radioLabel">{val}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <div className="formGroup">
                                    <label>Teaching language</label>
                                    <div className="radioGroup">
                                        {["bilingual", "arabic", "french", "english", "other"].map((val) => (
                                            <label key={val}>
                                                <input
                                                    type="radio"
                                                    value={val}
                                                    checked={modifyForm.teaching_language === val}
                                                    onChange={(e) => setModifyForm({ ...modifyForm, teaching_language: e.target.value })}
                                                />
                                                <span className="radioLabel">{val}</span>
                                            </label>
                                        ))}
                                    </div>
                                    {modifyForm.teaching_language === "other" && (
                                        <input
                                            type="text"
                                            placeholder="Specify language"
                                            value={modifyForm.teaching_language_other}
                                            onChange={(e) => setModifyForm({ ...modifyForm, teaching_language_other: e.target.value })}
                                            style={{ marginTop: "10px" }}
                                        />
                                    )}
                                </div>

                                <div className="formRow">
                                    <div className="formGroup">
                                        <label>University name (for college)</label>
                                        <input type="text" value={modifyForm.university_name} onChange={(e) => setModifyForm({ ...modifyForm, university_name: e.target.value })} />
                                    </div>
                                    <div className="formGroup">
                                        <label>Keywords (max 4)</label>
                                        <input type="text" value={modifyForm.keywords} onChange={(e) => setModifyForm({ ...modifyForm, keywords: e.target.value })} />
                                    </div>
                                </div>

                                <p style={{ opacity: 0.7, fontSize: "14px" }}>ℹ️ Our system requires real user comments to train the model before a school can be added to the database.</p>
                                <button type="submit">Update School</button>
                            </form>
                        </>
                    )}
                </div>

                {/* ════════════════ DELETE SCHOOL ════════════════ */}
                <h2 className="subtitle">Delete a school</h2>
                <div className="manAdd schoolSection deleteSection">
                    <h3 className="h3">Search school to delete</h3>
                    <SearchDropdown
                        query={deleteQuery}
                        onSearch={handleDeleteSearch}
                        results={deleteResults}
                        onSelect={selectDeleteSchool}
                        selected={selectedDeleteSchool}
                        placeholder="Search school to delete..."
                    />
                    <button
                        type="button"
                        onClick={handleDeleteSubmit}
                        style={{ opacity: selectedDeleteSchool ? 1 : 0.75 }}
                        disabled={!selectedDeleteSchool}
                    >Delete School</button>
                </div>

            </div>
        </div>
    );
}