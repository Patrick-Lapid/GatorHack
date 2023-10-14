import React from 'react';
import { render } from 'react-dom';
import Overlay from '../src/Overlay';

const extensionRoot = document.createElement('div');
extensionRoot.id = 'extension-root';
document.body.appendChild(extensionRoot);

render(<Overlay />, extensionRoot);
