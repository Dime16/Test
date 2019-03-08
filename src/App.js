import React, { Component } from 'react';
import { Route } from 'react-router-dom';

import Nav from './components/Nav/Nav';
import ReportPage from './containers/ReportPage/ReportPage';
import SelectedCountry from './containers/SelectedCountry/SelectedCountry';
import DashBoard from './containers/DashBoard/DashBoard';

import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="bg"></div>
        <Nav />
        <Route path='/' exact component={ReportPage} />
        <Route path='/country/:id' component={SelectedCountry} />
        <Route path='/dashboard'  component={DashBoard} />
      </div>
    );
  }
}

export default App;
