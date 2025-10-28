
import React, { useState } from 'react';
import axios from 'axios';

const BUG_FUN_FACTS = [
    'Dragonflies can fly up to 35 miles per hour, making them one of the fastest insects.',
    'Ladybugs smell with their feet and antennae when searching for food.',
    'A group of butterflies is called a flutter, but scientists call them a kaleidoscope!',
    'Fireflies produce light with nearly 100% efficiency—no heat wasted!',
    'Honeybees use a waggle dance to tell their hive mates where the best flowers are.'
];

function IdentifyBug() {
    const [file, setFile] = useState(null);
    const [result, setResult] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [funFact, setFunFact] = useState(BUG_FUN_FACTS[0]);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!file) {
            setResult('Please select a photo before uploading.');
            return;
        }

        const formData = new FormData();
        formData.append('bugImage', file);

        try {
            setIsLoading(true);
            const response = await axios.post('/api/bug/identify', formData);
            setResult(response.data);
        } catch (error) {
            console.error(error);
            setResult('Error identifying bug.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleFunFact = () => {
        const randomFact = BUG_FUN_FACTS[Math.floor(Math.random() * BUG_FUN_FACTS.length)];
        setFunFact(randomFact);
    };

    return (
        <div className="identify-bug">
            <h1>Identify a Bug</h1>
            <p className="tagline">Upload a photo to discover what creepy-crawly you have found!</p>
            <form className="upload-form" onSubmit={handleSubmit}>
                <label className="file-input-label">
                    <input type="file" onChange={handleFileChange} />
                </label>
                <button type="submit" disabled={isLoading}>
                    {isLoading ? 'Analyzing…' : 'Upload and Identify'}
                </button>
            </form>
            {result && <p className="result-message">{result}</p>}

            <section className="fun-facts">
                <h2>Need something fun while you wait?</h2>
                <p className="fun-fact">{funFact}</p>
                <button type="button" onClick={handleFunFact} className="fact-button">
                    Surprise me with another fact!
                </button>
            </section>
        </div>
    );
}

export default IdentifyBug;
