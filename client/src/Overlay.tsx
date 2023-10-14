import React from 'react';
import './index.css';

const Overlay = () => {
    return (
        <div
            className="overlay"
            title="GPT overlay"
            // src="https://example.com" // Replace with the URL you want to display
            style={{
                fontFamily: 'googleFont',
                position: 'fixed',
                top: '80%',
                left: 0,
                width: '100%',
                height: '20%',
                backgroundColor: '#f0f0f2',
                border: 'none',
                zIndex: 9999, // Adjust the z-index as needed
            }}
        >
            <div className="bg-slate-300 rounded-md text-white overlay">
                test
            </div>
        </div>
    );
};

export default Overlay;
