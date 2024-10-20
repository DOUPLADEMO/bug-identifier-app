
import React, { useState } from 'react';
import axios from 'axios';

function IdentifyBug() {
    const [file, setFile] = useState(null);
    const [result, setResult] = useState('');

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('bugImage', file);

        try {
            const response = await axios.post('/api/bug/identify', formData);
            setResult(response.data);
        } catch (error) {
            console.error(error);
            setResult('Error identifying bug.');
        }
    };

    return (
        <div>
            <h1>Identify a Bug</h1>
            <form onSubmit={handleSubmit}>
                <input type="file" onChange={handleFileChange} />
                <button type="submit">Upload and Identify</button>
            </form>
            <p>{result}</p>
        </div>
    );
}

export default IdentifyBug;
