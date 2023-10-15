import React, { useState } from 'react';
import './contentscript.css';
import { motion as m } from 'framer-motion';
import useMeasure from "react-use-measure";
import { SquareMinus } from 'tabler-icons-react';
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
    
    
    ws.send(buffer)
    //no clue why this won't compile without "buffer as any"
    const file = new File(buffer as any, 'me-at-thevoice.mp3', {
      type: blob.type,
      lastModified: Date.now(),
    });
  
    //const player = new Audio(URL.createObjectURL(file));
    //player.play();
    
  };

const Overlay = () => {

    console.log("y u no load")

    const image1Url = chrome.runtime.getURL('images/mic_black.png');
    const [expanded, setExpanded] = useState(false);
    const [ref, { height }] = useMeasure();


    return (        

        <m.div
            className="rounded-t-md"
            animate = {{ height: height + 37 }}
            transition={{ delay : 0.25 }}
            style={{
                fontFamily: 'googleFont',
                overflow:'hidden',
                position: 'fixed',
                bottom: 0,
                left: 0,
                width: '100%',
                backgroundColor: '#394150',
                border: 'none',
                zIndex: 9999, // Adjust the z-index as needed
            }}
        >
            {/* close btn */}
            <div className={`${expanded ? "block" : "hidden"} absolute top-5 right-5`}>
                <button onClick={() => setExpanded(false)} type="button" className="inline-flex border-none justify-center p-2 rounded-lg cursor-pointer  text-gray-400 hover:text-white hover:bg-gray-600">
                    <SquareMinus
                        size={20}
                        strokeWidth={1.5}
                        color={'#9da3ae'}
                    />
                </button>
            </div>
            {/* dynamic rendering of summary */}
            <div ref={ref}>
                {expanded && <p className='py-20 text-white container mx-auto'>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Quod similique atque inventore sunt totam laborum enim dignissimos unde nisi numquam, odio, consectetur magnam, laudantium possimus ad? Labore molestias veritatis iste.
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Quod similique atque inventore sunt totam laborum enim dignissimos unde nisi numquam, odio, consectetur magnam, laudantium possimus ad? Labore molestias veritatis iste.
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Quod similique atque inventore sunt totam laborum enim dignissimos unde nisi numquam, odio, consectetur magnam, laudantium possimus ad? Labore molestias veritatis iste.
                </p>}
            </div>
            {/* chatbot interface */}
            <form style={{
                position: 'fixed',
                width: '100%',
                bottom: 0,
                left: 0,
            }}>
                <label className="sr-only">Your message</label>
                <div className="flex items-center px-3 py-2 rounded-lg bg-gray-700">
                    
                    <AudioRecorder
                        width="20px"
                        height="20px"
                        bgcolor="#138481"
                        black={false}
                        recorder={
                        new MicRecorder({
                            bitRate: 128,
                        })
                        }
                        callback={callBack}
                    />
                    <textarea id="chat" rows={1} className="block active:shadow-md mx-4 p-2.5 w-full text-sm rounded-lg border bg-gray-800 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500" placeholder="Your message..."></textarea>
                        <button type="submit" className="inline-flex border-none justify-center p-2 rounded-full cursor-pointer text-blue-500 hover:bg-gray-600">
                        <svg className="w-5 h-5 border-none rotate-90" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 20">
                            <path d="m17.914 18.594-8-18a1 1 0 0 0-1.828 0l-8 18a1 1 0 0 0 1.157 1.376L8 18.281V9a1 1 0 0 1 2 0v9.281l6.758 1.689a1 1 0 0 0 1.156-1.376Z"/>
                        </svg>
                        <span className="sr-only">Send message</span>
                    </button>
                </div>
            </form>
        </m.div>
        
    );
};

export default Overlay;
