import React from 'react';
import ReactDOM from 'react-dom';
import AppLayout from './App';

it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<AppLayout />, div);
});
