import React from 'react';
import ReactDOM from 'react-dom';
import App from './app';
import './index.scss';

if (module.hot) {
    module.hot.accept('./app.js', () => {
        ReactDOM.render(<App />, document.getElementById('app'));
    });
}

ReactDOM.render(<App />, document.getElementById('app'));