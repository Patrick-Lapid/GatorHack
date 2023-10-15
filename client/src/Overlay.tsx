import React, { useState } from 'react';
import './contentscript.css';
import { motion as m } from 'framer-motion';
import useMeasure from "react-use-measure";
import { SquareMinus } from 'tabler-icons-react';
import AudioRecorder from './components/AudioRecorder';
import MicRecorder from 'mic-recorder-to-mp3';
import { type } from 'os';
import { filterPhoneSection, filterTabletSection } from './scripts/filter';

const registry = new Map<string,(arg0: any) => void>();

//deprecated, but kept to be flexible
const id = Math.random()


interface AudioRecorderProps {
    webSocket: WebSocket;
}

const Overlay: React.FC<AudioRecorderProps> = ({webSocket}) => {

    const ws = webSocket

    // When the connection is open, send the text
    ws.onopen = () => {
        //ws.send("AAAAA");
        ws.send(JSON.stringify({type: "register",id: id}))
    };

    // Log any messages received from the server
    ws.onmessage = (message) => {
            // console.log(`Received: ${message.data}`);
            const data = JSON.parse(message.data)
            
        const lambda = registry.get(data.type)
        //if lambda is not undefined, then execute it using data.data
        if (lambda !== undefined) {
            lambda(data.data)
        }
    };

    // Log any errors
    ws.onerror = (error) => {
        console.log(`WebSocket error: ${error}`);
    };


    const registerType = (s : string, callBack : ((arg0: any) => void) ) => {
        registry.set(s,callBack)
    }

    const callBack = (buffer : ArrayBuffer, blob : Blob) => {
        
        const msg = {
            id: id,
            type: "audioMessage",
            data: buffer
        }
        ws.send(JSON.stringify(msg))
    };


    const characterAnimation = {
        hidden: {
        opacity: 0,
        y: `0.25em`,
        },
        visible: {
        opacity: 1,
        y: `0em`,
        transition: {
            duration: 1,
            ease: [0.2, 0.65, 0.3, 0.9],
        },
        },
    };



    const chatRef = React.useRef<HTMLInputElement>(null);
    const handleMessageSend = () => {
        const message = chatRef.current?.value;
        ws.send(JSON.stringify({type: "chatMessage",id: id,data: message}))
    };
    console.log("y u no load")

    const image1Url = chrome.runtime.getURL('images/mic_black.png');
    const [expanded, setExpanded] = useState(false);
    const [ref, { height }] = useMeasure();
    const [response, setResponse] = useState("");


    registerType("streamChars", (s: any) => {
        const str = s as string
        setExpanded(true)
        setResponse(str)}
    )

    type ActionButtonData = {
        display: {
            type: string; 
            data: any;
        };
        action: {
            type: string;
            data: any;
        }
    };

    //3 actions in the array
    registerType("recieveActions", (actions : ActionButtonData[] ) => {
        console.log(actions)
    })
    registerType("filterPhone", async (arr: any) => {
        const filterParams = ["Google", "Nokia", "$30-$40"]
        filterPhoneSection(filterParams);
    })

    registerType("filterTablet", async (arr: any) => {
        const filterParams = ["Laptops", "iPadGeneration", "New"]
        filterTabletSection(filterParams);
    })

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
                {response}
                </p>}
                
            </div>
            
            {/* chatbot interface */}
            <form style={{
                position: 'fixed',
                width: '100%',
                bottom: 0,
                left: 0,
            }}>
                <div className="container" style={expanded ? {
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                } : {display:'none'}}>
                    <div className="box" style={{ margin: '2px 10px', padding: '5px 20px' }}>Box 1</div>
                    <div className="box" style={{ margin: '2px 10px', padding: '5px 20px' }}>Box 2</div>
                    <div className="box" style={{ margin: '2px 10px', padding: '5px 20px' }}>Box 3</div>
                </div>
                <label className="sr-only">Your message</label>
                <div className="flex items-center px-3 py-2 rounded-lg bg-gray-700">
                    
                    <AudioRecorder
                        width="30px"
                        height="30px"
                        bgcolor="#138481"
                        black={false}
                        recorder={
                        new MicRecorder({
                            bitRate: 128,
                        })
                        }
                        callback={callBack}
                    />
                    <input type='text' id="chat" ref={chatRef} className="block active:shadow-md mx-4 p-2.5 w-full text-sm rounded-lg border bg-gray-800 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500" placeholder="Your message..." />
                        <button onClick={(event) => {event.preventDefault(); setExpanded(true); handleMessageSend() }} className="inline-flex border-none justify-center p-2 rounded-full cursor-pointer text-blue-500 hover:bg-gray-600">
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
