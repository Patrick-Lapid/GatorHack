import React from 'react';
import './contentscript.css';

const Overlay = () => {

    const image1Url = chrome.runtime.getURL('images/mic_black.png');

    return (
        <div
            className=""
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
            <div className="overlay">
                <div>element 1</div>
                <div>element 2</div>
                <div>element 3</div>
            </div>
            <img alt="img" src={image1Url} height={20} width={20}></img>
        </div>
    );
};

export default Overlay;
