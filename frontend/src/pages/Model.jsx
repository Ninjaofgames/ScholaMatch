import React from "react";
import './styleComponents.css';

export default function Model(){
    return(
        <div className="modelMain">
            <h1 className="title">Model training</h1>
            <div className="center">
                <div className="dropArea">
                    <h3>Add a csv file</h3>
                    <div className="otherDrop">
                        <i className="fa-solid fa-download"></i><br />
                        <button className="uploadBtn">UPLOAD</button>
                        <p>Drop your file here, or click to browse</p>
                    </div>
                </div>
            </div>
        </div>
    );
}