import React from 'react';
import ReactDOM from 'react-dom';
import Overlay from './Overlay';

console.log('overlay injected');

// const fontUrl = chrome.runtime.getURL('external-font.woff2');

// Create a new iframe element
const iframe = document.createElement('div');
document.body.appendChild(iframe);

// Append the iframe to the host site's body

document.body.appendChild(iframe);
ReactDOM.render(<Overlay />, iframe);
