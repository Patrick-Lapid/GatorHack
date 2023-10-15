import React, { useEffect, useState } from 'react';
import './contentscript.css';
import { motion as m } from 'framer-motion';
import useMeasure from "react-use-measure";
import { ExternalLink, SquareMinus } from 'tabler-icons-react';
import AudioRecorder from './components/AudioRecorder';
import MicRecorder from 'mic-recorder-to-mp3';
import { filterPhoneSection, filterTabletSection } from './scripts/filter';
import { scroll } from './scripts/scroll';

const registry = new Map<string,(arg0: any) => void>();

//deprecated, but kept to be flexible
const id = Math.random()

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

interface AudioRecorderProps {
    webSocket: WebSocket;
}

const Overlay: React.FC<AudioRecorderProps> = ({webSocket}) => {
    const currentUrl = window.location.href;
    
    const chatRef = React.useRef<HTMLInputElement>(null);
    const handleMessageSend = () => {
        const message = chatRef.current?.value;
        ws.send(JSON.stringify({type: "chatMessage",id: id,data: message}))
    };

    const [expanded, setExpanded] = useState(false);
    const [loading, setLoading] = useState(true);
    const [actionBus, setActionBus] = useState<ActionButtonData[]>([]);
    const [summaryText, setSummaryText] = useState<string>("");
    const [links, setLinks] = useState<string[]>([]);
    const [ref, { height }] = useMeasure();
    const [response, setResponse] = useState("");

    const ws = webSocket

    // When the connection is open, send the text
    ws.onopen = () => {
        //ws.send("AAAAA");
        ws.send(JSON.stringify({type: "register",data:{url: currentUrl}}))
        
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

    registerType("streamChars", (s: any) => {
        const str = s as string
        setExpanded(true)
        setResponse(str)}
    )


    useEffect(() => {
        // call the first one + update summary text and links
        actionBus.forEach(action => {

        });

        if(actionBus.length > 0){
            setLoading(false);
        }

    }, [actionBus])


    //3 actions in the array
    registerType("recieveActions", (actions : ActionButtonData[] ) => {
        setActionBus(actions);
        console.log(actions);
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
            <div className={`${expanded ? "block" : "hidden"} absolute`} style={{top: "13px", right: "13px"}} >
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
                {expanded && <p className='text-white w-[90%] mx-auto my-8 leading-loose'>
                {response}
                Our Father, which art in heaven, Hallowed be thy Name. Thy Kingdom come. Thy will be done in earth, As it is in heaven. Give us this day our daily bread. And forgive us our trespasses, As we forgive them that trespass against us. And lead us not into temptation, But deliver us from evil. For thine is the kingdom, The power, and the glory, For ever and ever. Amen. Our Father, which art in heaven, Hallowed be thy Name. Thy Kingdom come. Thy will be done in earth, As it is in heaven. Give us this day our daily bread. And forgive us our trespasses, As we forgive them that trespass against us. And lead us not into temptation, But deliver us from evil. For thine is the kingdom, The power, and the glory, For ever and ever. Amen. Our Father, which art in heaven, Hallowed be thy Name. Thy Kingdom come. Thy will be done in earth, As it is in heaven. Give us this day our daily bread. And forgive us our trespasses, As we forgive them that trespass against us. And lead us not into temptation, But deliver us from evil. For thine is the kingdom, The power, and the glory, For ever and ever. Amen
                </p>}
                {expanded &&
                    <m.div className='flex gap-4 pb-16 mx-auto w-[90%] text-white'>
                        <div onClick={() => scroll("Up")} className="cursor-pointer flex items-center p-2 text-base font-bold rounded-lg bg-gray-600 hover:bg-gray-500 group hover:shadowtext-white">
                            <span className="whitespace-nowrap pr-3">Link 1 - scroll up</span>
                            <ExternalLink
                                size={15}
                                strokeWidth={1.5}
                                color={'white'}
                            />
                        </div>
                        <div onClick={() => scroll("Down")} className="cursor-pointer flex items-center p-2 text-base font-bold rounded-lg bg-gray-600 hover:bg-gray-500 group hover:shadowtext-white">
                            <span className="whitespace-nowrap pr-3">Link 2 - scroll down</span>
                            <ExternalLink
                                size={15}
                                strokeWidth={1.5}
                                color={'white'}
                            />
                        </div>
                    </m.div>
                }
                
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
                        width="35px"
                        height="35px"
                        bgcolor="#138481"
                        black={false}
                        recorder={
                        new MicRecorder({
                            bitRate: 128,
                        })
                        }
                        callback={callBack}
                    />
                    <input type='text' id="chat" ref={chatRef} className="w-[90%] tracking-wide block active:shadow-md mr-4 ml-4 p-2.5 text-md rounded-lg border bg-gray-800 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500" placeholder="Your message..." />
                        <button onClick={(event) => {event.preventDefault(); setExpanded(!expanded); handleMessageSend() }} className="inline-flex border-none justify-center p-2 cursor-pointer text-blue-500 hover:bg-gray-600 rounded-lg">
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
