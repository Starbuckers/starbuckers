import polyfill from 'babel-polyfill';
import Promise from 'bluebird';
global.Promise = Promise;

import React from 'react';
import ReactDOM from 'react-dom';
import AppContainer from './containers/AppContainer';

import injectTapEventPlugin from 'react-tap-event-plugin';

injectTapEventPlugin();

ReactDOM.render(
  <AppContainer />,
  document.getElementById('root')
);
