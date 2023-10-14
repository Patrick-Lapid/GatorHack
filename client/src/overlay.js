import React from 'react';
import ReactDOM from 'react-dom';
import Overlay from './Overlay';

console.log('overlay injected');

// Create a new div element
const iframe = document.createElement('div');
document.body.appendChild(iframe);

// Append the div to the host site's body
document.body.appendChild(iframe);
ReactDOM.render(<Overlay />, iframe);
