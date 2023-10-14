import React from 'react';
import './contentscript.css';
import AudioRecorder from './components/AudioRecorder';
import MicRecorder from 'mic-recorder-to-mp3';

const ws = new WebSocket('ws://localhost:8765');

    // When the connection is open, send the text
    ws.onopen = () => {
        ws.send("AAAAA");
    };

    // Log any messages received from the server
    ws.onmessage = (message) => {
        console.log(`Received: ${message.data}`);
    };

    // Log any errors
    ws.onerror = (error) => {
        console.log(`WebSocket error: ${error}`);
    };

const callBack = (buffer : ArrayBuffer, blob : Blob) => {
    // do what ever you want with buffer and blob
    // Example: Create a mp3 file and play
    
  
    //no clue why this won't compile without "buffer as any"
    const file = new File(buffer as any, 'me-at-thevoice.mp3', {
      type: blob.type,
      lastModified: Date.now(),
    });
  
    //const player = new Audio(URL.createObjectURL(file));
    //player.play();
    
    const filename = "aaaa.mp3"
    var a = document.createElement("a"),
            url = URL.createObjectURL(file);
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(function() {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);  
        }, 0); 
    
  };

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
