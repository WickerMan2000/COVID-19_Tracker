import React from 'react';
import ReactDOM from 'react-dom';
import InputContextProvider from './store/InputContextProvider';

import './index.css';
import App from './App';

ReactDOM.render(<InputContextProvider><App /></InputContextProvider>, document.getElementById('root'));