import React, { useState, useEffect } from "react";
import './modelStyle.css';
import axios from "axios";

export default function SchoolManagement(){
    // ── Add Form State ──
    const [addForm, setAddForm] = useState({
        name: "", website_link: "", location: "", location_link: "",
        mail: "", phone: "", funding_type: "", education_level: "",
        teaching_language: "", teaching_language_other: "",
        university_name: "", keywords: "", thumbnail: null,
    });

    // ── Modify Form State ──
    const [modifyForm, setModifyForm] = useState({
        name: "", website_link: "", location: "", location_link: "",
        mail: "", phone: "", funding_type: "", education_level: "",
        teaching_language: "", teaching_language_other: "",
        university_name: "", keywords: "", thumbnail: null,
    });

    const [searchId, setSearchId] = useState("");
    const [deleteId, setDeleteId] = useState("");

    // ── Handlers ──
    const handleDrop = (e, setter, form) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith("image/")) {
            setter({ ...form, thumbnail: file });
        }
    };

    const handleAddSubmit = async () => {
        try {
            const formData = new FormData();
            Object.entries(addForm).forEach(([key, val]) => {
                if (val !== null && val !== "") formData.append(key, val);
            });
            await axios.post("http://127.0.0.1:8000/api/schools/", formData);
            alert("School added successfully!");
            setAddForm({
                name: "", website_link: "", location: "", location_link: "",
                mail: "", phone: "", funding_type: "", education_level: "",
                teaching_language: "", teaching_language_other: "",
                university_name: "", keywords: "", thumbnail: null,
            });
        } catch (error) {
            alert("Error adding school: " + (error.response?.data?.error || "Unknown error"));
        }
    };

    const handleSearch = async () => {
        try {
            const response = await axios.get(`http://127.0.0.1:8000/api/schools/${searchId}/`);
            const school = response.data;
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
                teaching_language_other: school.teaching_language_other || "",
                university_name: school.university_name || "",
                keywords: school.keywords || "",
                thumbnail: null,
            });
        } catch (error) {
            alert("School not found: " + (error.response?.data?.error || "Unknown error"));
        }
    };

    const handleModifySubmit = async () => {
        try {
            const formData = new FormData();
            Object.entries(modifyForm).forEach(([key, val]) => {
                if (val !== null && val !== "") formData.append(key, val);
            });
            await axios.put(`http://127.0.0.1:8000/api/schools/${searchId}/`, formData);
            alert("School updated successfully!");
        } catch (error) {
            alert("Error updating school: " + (error.response?.data?.error || "Unknown error"));
        }
    };

    const handleDeleteSubmit = async () => {
        try {
            await axios.delete(`http://127.0.0.1:8000/api/schools/${deleteId}/`);
            alert("School deleted successfully!");
            setDeleteId("");
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
                        <h3 className="h3">Thumbnail photo</h3>
                        <div
                            className="dropArea"
                            onDrop={(e) => handleDrop(e, setAddForm, addForm)}
                            onDragOver={(e) => e.preventDefault()}
                            style={{width:"91%"}}
                        >
                            <div className="otherDrop">
                                <i className="fa-solid fa-image"></i>
                                <button
                                    className="uploadBtn"
                                    type="button"
                                    onClick={() => document.getElementById("thumbnail_add").click()}
                                >
                                    UPLOAD
                                </button>
                                <input
                                    id="thumbnail_add"
                                    type="file"
                                    accept="image/png,image/jpeg,image/jpg,image/gif"
                                    style={{ display: "none" }}
                                    onChange={(e) => setAddForm({ ...addForm, thumbnail: e.target.files[0] })}
                                />
                                <p>{addForm.thumbnail ? `✓ ${addForm.thumbnail.name}` : "Drop your image here, or click to browse"}</p>
                                <span style={{fontSize: "12px", opacity: 0.6}}>1600 × 900 px recommended · PNG, JPG, GIF</span>
                            </div>
                        </div>

                        <h3 className="h3">School information</h3>
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
                                        {["primary", "middle", "high", "college"].map((val) => (
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
                <h2 className="subtitle">Modify a school</h2>
                <div className="manAdd schoolSection">
                    <h3 className="h3">Search by ID</h3>
                    <div className="searchBar">
                        <div className="formGroup" style={{ flex: 1 }}>
                            <input type="text" placeholder="Enter school ID" value={searchId} onChange={(e) => setSearchId(e.target.value)} />
                        </div>
                        <button type="button" onClick={handleSearch}>Search</button>
                    </div>

                    <h3 className="h3">Update thumbnail</h3>
                    <div
                        className="dropArea"
                        onDrop={(e) => handleDrop(e, setModifyForm, modifyForm)}
                        onDragOver={(e) => e.preventDefault()}
                    >
                        <div className="otherDrop">
                            <i className="fa-solid fa-image"></i>
                            <button
                                className="uploadBtn"
                                type="button"
                                onClick={() => document.getElementById("thumbnail_modify").click()}
                            >
                                UPLOAD
                            </button>
                            <input
                                id="thumbnail_modify"
                                type="file"
                                accept="image/png,image/jpeg,image/jpg,image/gif"
                                style={{ display: "none" }}
                                onChange={(e) => setModifyForm({ ...modifyForm, thumbnail: e.target.files[0] })}
                            />
                            <p>{modifyForm.thumbnail ? `✓ ${modifyForm.thumbnail.name}` : "Drop your image here, or click to browse"}</p>
                        </div>
                    </div>

                    <h3 className="h3">School information</h3>
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
                                {["primary", "middle", "high", "college"].map((val) => (
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
                </div>

                {/* ════════════════ DELETE SCHOOL ════════════════ */}
                <h2 className="subtitle">Delete a school</h2>
                <div className="manAdd schoolSection deleteSection">
                    <h3 className="h3">Remove by ID</h3>
                    <form onSubmit={(e) => { e.preventDefault(); handleDeleteSubmit(); }}>
                        <div className="formGroup">
                            <label>Enter the ID of school to delete</label>
                            <input type="text" placeholder="School ID" value={deleteId} onChange={(e) => setDeleteId(e.target.value)} required />
                        </div>
                        <button type="submit">Delete School</button>
                    </form>
                </div>

            </div>
        </div>
    );
}