import React from 'react';
import ReactDOM from 'react-dom';
import 'babel-polyfill';
import App from './App';
//import registerServiceWorker from './registerServiceWorker';
import { HashRouter } from 'react-router-dom'
import ScrollToTop from './ScrollToTop';

ReactDOM.render(
    <HashRouter>
        <ScrollToTop>
            <App></App>
        </ScrollToTop>
    </HashRouter>,
    document.getElementById('root')
);

//registerServiceWorker();