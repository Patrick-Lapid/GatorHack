import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css';
import Plans from './pages/Plans';
import Home from './pages/Home';

function App() {
  return (

    <BrowserRouter>
      <Routes>
         <Route path="/">
          <Route index element={<Home />} />
          <Route path="plans" element={<Plans />} />
        </Route>
      </Routes>
    </BrowserRouter>

    
  );
}

export default App;


/*
import React from 'react';
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

  const player = new Audio(URL.createObjectURL(file));
  player.play();
};

const App: React.FC = () => {
  return (
    <AudioRecorder
      width="100px"
      height="100px"
      bgcolor="#98FF98"
      black={false}
      recorder={
        new MicRecorder({
          bitRate: 128,
        })
      }
      callback={callBack}
    />
  );
};

export default App;
*/