import React from 'react';
import ReactDOM from 'react-dom';
import 'babel-polyfill';
import App from './App';
//import registerServiceWorker from './registerServiceWorker';
import { HashRouter } from 'react-router-dom'

ReactDOM.render(
    <HashRouter>
        <App></App>
    </HashRouter>,
    document.getElementById('root')
);

//registerServiceWorker();