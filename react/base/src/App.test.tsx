import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

//@ts-ignore
global.crypto = require('@trust/webcrypto');

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
  ReactDOM.unmountComponentAtNode(div);
});
