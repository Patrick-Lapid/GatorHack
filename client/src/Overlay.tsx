import React, { useEffect, useState } from 'react';
import './contentscript.css';
import { motion as m } from 'framer-motion';
import useMeasure from "react-use-measure";
import { SquareMinus } from 'tabler-icons-react';
import AudioRecorder from './components/AudioRecorder';
import MicRecorder from 'mic-recorder-to-mp3';
import ReactDOM from 'react-dom';

const registry = new Map<string,(arg0: any) => void>();

const ws = new WebSocket('ws://localhost:8765');

    // When the connection is open, send the text
    ws.onopen = () => {
        //ws.send("AAAAA");
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
        console.log(`WebSocket error: ${JSON.stringify(error)}`);
        
    };


    const registerType = (s : string, callBack : ((arg0: any) => void) ) => {
        registry.set(s,callBack)
    }

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

const filterCategories = []

const filter = async (filterParams: any) => {

    console.log("filtering...");
    const brandDropdown : HTMLElement | null = document.querySelector('#accordian-content > div > div > div:nth-child(1) > div.StyledAccordionItem-VDS__sc-h2bqgc-1.mCOTK > div.WrapperDiv-VDS__sc-19osi3m-3.jFGcii > button') as HTMLElement;
    const osDropdown : HTMLElement | null = document.querySelector('#accordian-content > div > div > div:nth-child(2) > div.StyledAccordionItem-VDS__sc-h2bqgc-1.mCOTK > div.WrapperDiv-VDS__sc-19osi3m-3.jFGcii > button') as HTMLElement;
    const specialOffersDropdown : HTMLElement | null = document.querySelector('#accordian-content > div > div > div:nth-child(3) > div.StyledAccordionItem-VDS__sc-h2bqgc-1.mCOTK > div.WrapperDiv-VDS__sc-19osi3m-3.jFGcii > button') as HTMLElement;
    const inStorePickupDropdown : HTMLElement | null = document.querySelector('#accordian-content > div > div > div:nth-child(4) > div.StyledAccordionItem-VDS__sc-h2bqgc-1.mCOTK > div.WrapperDiv-VDS__sc-19osi3m-3.jFGcii > button') as HTMLElement;
    const priceDropdown : HTMLElement | null = document.querySelector('#accordian-content > div > div > div:nth-child(5) > div.StyledAccordionItem-VDS__sc-h2bqgc-1.mCOTK > div.WrapperDiv-VDS__sc-19osi3m-3.jFGcii > button') as HTMLElement;
    const conditionDropdown : HTMLElement | null = document.querySelector('#accordian-content > div > div > div:nth-child(6) > div.StyledAccordionItem-VDS__sc-h2bqgc-1.mCOTK > div.WrapperDiv-VDS__sc-19osi3m-3.jFGcii > button') as HTMLElement;
    const availabilityDropdown : HTMLElement | null = document.querySelector('#accordian-content > div > div > div:nth-child(7) > div.StyledAccordionItem-VDS__sc-h2bqgc-1.mCOTK > div.WrapperDiv-VDS__sc-19osi3m-3.jFGcii > button') as HTMLElement;
    const colorDropdown : HTMLElement | null = document.querySelector('#accordian-content > div > div > div:nth-child(8) > div.StyledAccordionItem-VDS__sc-h2bqgc-1.mCOTK > div.WrapperDiv-VDS__sc-19osi3m-3.jFGcii > button') as HTMLElement;
    
    brandDropdown && brandDropdown.click();
    osDropdown && osDropdown.click();
    specialOffersDropdown && specialOffersDropdown.click();
    inStorePickupDropdown && inStorePickupDropdown.click();
    priceDropdown && priceDropdown.click();
    conditionDropdown && conditionDropdown.click();
    availabilityDropdown && availabilityDropdown.click();
    await colorDropdown && colorDropdown.click();

    function getCheckboxByValue(val : string) {
        const checkboxes = document.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(function(checkbox : any) {
            if (checkbox.attributes.value.value === val) {
                checkbox.click();
            }
        });
    }

    for(const val of filterParams){
        await getCheckboxByValue(val);
    }

    await getCheckboxByValue("Nokia");
    await getCheckboxByValue("Google");

    setTimeout(() => {
        const apply : HTMLElement | null = document.querySelectorAll('[data-testid="applyFilter"]') as any
        apply && apply.click();
      }, 1000);
  
    
    // applyFilter
    
    // const brandBoxes : HTMLElement = document.getElementById('#clnr2qe00005q359mr9ec2jj8') as HTMLElement;
    
    // brandBoxes.click();

    // for(const val of filterParams){
    //     if(val.length === 0){
    //         continue;
    //     }

    //     for(const item of val){

    //     }
    // }


    
    // if ($('body:contains("Filter")').length) {
    //     for(const [key, param] of filterParams.entries()){
    //         if(!param){
    //             continue;
    //         } else {
    //             console.log(key, param);
    //             // const element = document.querySelector(`[data-testid="${param}"]`);
    //             const element : HTMLElement = document.querySelector('#accordian-content > div > div > div:nth-child(1)') as HTMLElement;
                
    //             if (element) {
    //                 element.click();
    //                 console.log('Element found:', element);
    //             } else {
    //                 console.log('Element not found.');
    //             }
                  
                               
    //         }
    //     }
    //     // filterParams.map((x : any) => console.log(x));
    // } else {
    //     console.log("No Filter on Page.");
    // }

}

const Overlay = () => {

    const image1Url = chrome.runtime.getURL('images/mic_black.png');
    const [expanded, setExpanded] = useState(false);
    const [ref, { height }] = useMeasure();
    const [response, setResponse] = useState("");

    registerType("streamChars", (s: any) => {
        const str = s as string
        setResponse(response+str)}
    )

    registerType("filter", async (arr: any) => {
        // filterParam = {}
        filter(arr);
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
                    <input type='text' id="chat" className="block active:shadow-md mx-4 p-2.5 w-full text-sm rounded-lg border bg-gray-800 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500" placeholder="Your message..." />
                        <button onClick={(event) => {event.preventDefault(); setExpanded(!expanded);}} className="inline-flex border-none justify-center p-2 rounded-full cursor-pointer text-blue-500 hover:bg-gray-600">
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
