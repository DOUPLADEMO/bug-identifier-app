import React, { useState } from 'react';
import axios from 'axios';

function IdentifyBug() {
    const [file, setFile] = useState(null);
    const [result, setResult] = useState('');

    const handleFileChange = (event) => {
        if (!event.target.files || event.target.files.length === 0) {
            setFile(null);
            return;
        }
        setFile(event.target.files[0]);
        setResult('');
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!file) {
            setResult('Please choose an image of a bug before uploading.');
            return;
        }

        const formData = new FormData();
        formData.append('bugImage', file);

        try {
            setResult('Analyzing your image...');
            const response = await axios.post('/api/bug/identify', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setResult(response.data);
        } catch (error) {
            console.error(error);
            setResult('Error identifying bug. Please try again later.');
        }
    };

    return (
        <section className="identify-bug-card">
            <h2>Bug Identifier</h2>
            <p className="identify-bug-description">
                Upload a photo of an insect and our identification service will tell you what it thinks the species is.
                Perfect for curious explorers and home gardeners alike.
            </p>
            <form className="identify-bug-form" onSubmit={handleSubmit}>
                <label className="file-input-label">
                    <span>{file ? file.name : 'Choose an image to upload'}</span>
                    <input type="file" accept="image/*" onChange={handleFileChange} />
                </label>
                <button type="submit" disabled={!file}>
                    Upload and Identify
                </button>
            </form>
            {result && <p className="identify-bug-result">{result}</p>}
        </section>
    );
}

export default IdentifyBug;
