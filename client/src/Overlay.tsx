import React from 'react';
import './contentscript.css';
import AudioRecorder from './components/AudioRecorder';
import MicRecorder from 'mic-recorder-to-mp3';

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
        <>
        <div className=''>

        </div>
        <div
            className="rounded-t-md"
            style={{
                fontFamily: 'googleFont',
                overflow:'hidden',
                position: 'fixed',
                top: '93%',
                left: 0,
                width: '100%',
                height: '7%',
                backgroundColor: '#394150',
                border: 'none',
                // paddingBottom: "5px",
                zIndex: 9999, // Adjust the z-index as needed
            }}
        >
            <form>
                <label  className="sr-only">Your message</label>
                <div className="flex items-center px-3 py-2 rounded-lg bg-gray-700">
                    <button type="button" className="inline-flex border-none justify-center p-2 rounded-lg cursor-pointer  text-gray-400 hover:text-white hover:bg-gray-600">
                        <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 18">
                            <path fill="currentColor" d="M13 5.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0ZM7.565 7.423 4.5 14h11.518l-2.516-3.71L11 13 7.565 7.423Z"/>
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 1H2a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1Z"/>
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 5.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0ZM7.565 7.423 4.5 14h11.518l-2.516-3.71L11 13 7.565 7.423Z"/>
                        </svg>
                        <span className="sr-only">Upload image</span>
                    </button>
                    <textarea id="chat" rows={1} className="block active:shadow-md mx-4 p-2.5 w-full text-sm rounded-lg border bg-gray-800 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500" placeholder="Your message..."></textarea>
                        <button type="submit" className="inline-flex border-none justify-center p-2 rounded-full cursor-pointer text-blue-500 hover:bg-gray-600">
                        <svg className="w-5 h-5 border-none rotate-90" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 20">
                            <path d="m17.914 18.594-8-18a1 1 0 0 0-1.828 0l-8 18a1 1 0 0 0 1.157 1.376L8 18.281V9a1 1 0 0 1 2 0v9.281l6.758 1.689a1 1 0 0 0 1.156-1.376Z"/>
                        </svg>
                        <span className="sr-only">Send message</span>
                    </button>
                </div>
            </form>
        </div>
        </>
        
    );
};

export default Overlay;
