import React from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;


/*
import React from 'react';
import AudioRecorder from './AudioRecorder';
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