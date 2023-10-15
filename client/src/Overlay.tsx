import React, { useEffect, useState } from 'react';
import './contentscript.css';
import { motion as m } from 'framer-motion';
import useMeasure from "react-use-measure";
import { Eraser, ExternalLink, SquareMinus } from 'tabler-icons-react';
import AudioRecorder from './components/AudioRecorder';
import MicRecorder from 'mic-recorder-to-mp3';
import { filterPhoneSection, filterTabletSection } from './scripts/filter';
import { scroll } from './scripts/scroll';
import { sortBy } from './scripts/sort';

const registry = new Map<string,(arg0: any) => void>();

//deprecated, but kept to be flexible
const id = Math.random()

interface AudioRecorderProps {
    webSocket: WebSocket;
}

interface summaryResponse {
    summary : string;
    links : string[];
}

interface actionResponse {
    act : string; // filterPhone, filterTablet, scroll, sort
    act_list : string[];
}

interface linkProps {
    label : string;
    link : string;
    navigateHandler : (link : string) => void;
}

const LinkCard = ({label, link, navigateHandler} : linkProps) => {
    return(
        <div onClick={() => navigateHandler(link)} className="cursor-pointer flex items-center p-2 text-base font-bold rounded-lg bg-gray-600 hover:bg-gray-500 group hover:shadowtext-white">
            <span className="whitespace-nowrap px-2 mr-3">{label}</span>
            <ExternalLink
                size={15}
                strokeWidth={1.5}
                color={'white'}
            />
        </div>
    );
    
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
    const [event, setEvent] = useState<summaryResponse | actionResponse | null>(null);
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

    const onNavigate = (link : string) => {

    }

    const resetPrompt = () => {
        setLinks([]);
        setEvent(null);
        setLoading(false);
        setExpanded(false);
        setResponse("");
    }

    const isSummaryResponse = (object: any): object is summaryResponse => {
        if(object.summary){
            return true;
        } else {
            return false;
        }
    }

    useEffect(() => {

        if(!event){
            return;
        }

        setResponse("");

        // call the first one + update summary text and links
        if (isSummaryResponse(event)) {
            // `event` has type `summaryResponse`.
            setLinks(event.links);

        } else {
            // `event` has type `actionResponse`.
            // update screen + perform action
            if(event?.act === "filterPhone") {
                
                setResponse("Filtering phones...");
                filterPhoneSection(event.act_list);

            } else if (event?.act === "filterTablet"){

                setResponse("Filtering tablets by: ")
                filterTabletSection(event.act_list);

            } else if (event?.act === "scroll") {

                setResponse(`Scrolling ${event.act_list[0]}... `)
                scroll(event.act_list[0]);

            } else if (event?.act === "sort") {

                setResponse(`Sorting by ${event.act_list[0]}`)
                sortBy(event.act_list[0]);
            }
        }

        if(event){
            setLoading(false);
        }

    }, [event])


    // 2 types of responses
    
    registerType("summaryResponse", (summaryObj : summaryResponse ) => {
        setEvent(summaryObj);
        console.log(summaryObj);
    })

    registerType("actionResponse", async (actionObj : actionResponse) => {
        setEvent(actionObj);
        console.log(actionObj);
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
            <div className={`${expanded ? "block" : "hidden"} absolute flex`} style={{top: "13px", right: "13px"}} >
                <button onClick={() => resetPrompt()} type="button" className="inline-flex border-none justify-center p-2 rounded-lg cursor-pointer  text-gray-400 hover:text-white hover:bg-gray-600">
                    <Eraser
                        size={20}
                        strokeWidth={1.5}
                        color={'#9da3ae'}
                    />
                </button>
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
                </p>}
                {expanded &&
                    <div className='flex gap-4 pb-16 mx-auto w-[90%] text-white tracking-wide'>
                        {links.map((link, index) => 
                            <LinkCard label={link} key={index} navigateHandler={() => {}} link='#' />
                        )}
                    </div>
                }
                
            </div>
            
            {/* chatbot interface */}
            <form 
            onSubmit={(event) => {event.preventDefault(); setExpanded(!expanded); handleMessageSend(); setLoading(true)}}
            style={{
                position: 'fixed',
                width: '100%',
                bottom: 0,
                left: 0,
            }}>
                
                <label className="sr-only">Your message</label>
                <div className="flex items-center pl-5 py-2 rounded-lg bg-gray-700">
                    {loading &&
                        <div className="kinetic h-8 w-8 pt-3 pl-4"></div>
                    }
                    {!loading &&
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
                    }
                    
                    <input type='text' disabled={loading} id="chat" ref={chatRef} className="w-[95%] ml-4 tracking-wide block active:shadow-md p-2.5 text-md rounded-lg border bg-gray-800 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500" placeholder="Your message..." />
                        <button disabled={loading} type='submit' className="inline-flex mx-4 border-none justify-center p-2 cursor-pointer text-blue-500 hover:bg-gray-600 rounded-lg">
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
