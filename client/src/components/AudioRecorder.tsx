import React, { useState } from 'react';


const whiteImage1Url = chrome.runtime.getURL('images/mic_white.png');
const blackImage1Url = chrome.runtime.getURL('images/mic_black.png');

interface AudioRecorderProps {
  width: string;
  height: string;
  bgcolor: string;
  black: boolean;
  recorder: any;
  callback: (arg0: ArrayBuffer,arg1: Blob) => void;
}

const AudioRecorder: React.FC<AudioRecorderProps> = ({
  width,
  height,
  bgcolor,
  black,
  recorder,
  callback,
}) => {
  const style = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: width,
    height: height,
    borderRadius: '50%',
    overflow: 'hidden',
    backgroundColor: bgcolor,
  };

  const [isVisible, setIsVisible] = useState(true);

  const imageStyle = {
    width: '100%',
    height: '100%',
    display: isVisible ? 'block' : 'none',
  };

  const handleMouseDown = () => {
    console.log('Mouse down');
    // Add your logic here
    recorder.start();
    setIsVisible(false);
  };

  const squareStyle = {
    top: '50%',
    left: '50%',
    width: '50px',
    height: '50px',
    backgroundColor: black ? 'black' : 'white',
    animation: isVisible ? '' : 'fadeinout 2s infinite',
    display: isVisible ? 'none' : 'block', // toggle visibility based on state
  };

  const handleMouseUp = () => {
    console.log('Mouse up');

    setIsVisible(true);
    // Add your logic here
    recorder
      .stop()
      .getMp3()
      .then(([buffer, blob] : any) => {
        callback(buffer as ArrayBuffer, blob as Blob);
      });
  };

  return (
    <div style={style} onMouseDown={handleMouseDown} onMouseUp={handleMouseUp}>
      <img
        style={imageStyle}
        src={black ? blackImage1Url : whiteImage1Url}
        alt="microphone"
      />
      <div style={squareStyle} />
      <style>
        {`
          @keyframes fadeinout {
            0%,100% { opacity: 1; }
            50% { opacity: 0.0; }
          }
        `}
      </style>
    </div>
  );
};

export default AudioRecorder;
