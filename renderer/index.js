import React from 'react';
import {render} from 'react-dom';
import Root from './Root';
import electron from 'electron';

window.electron = electron;

const node = document.createElement('div');
document.body.appendChild(node);

render(<Root/>, node);