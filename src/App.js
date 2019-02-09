import React, { Component } from 'react';
import { Provider } from 'react-redux';

import store from './store';
import MemberDataGrid from 'modules/MemberDataGrid';

import './App.css';
import 'react-virtualized/styles.css';
import 'css/material-design-iconic-font.min.css';

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <div className="App">
          <MemberDataGrid />
        </div>
      </Provider>
    );
  }
}

export default App;
