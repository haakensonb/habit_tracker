import React, { Component } from 'react';
import './App.css';
import {
  BrowserRouter as Router,
  Route,
  Switch
} from 'react-router-dom'
import HomePage from './HomePage';
import RegistrationPage from './RegistrationPage';
import LoginPage from './LoginPage';
import HabitsPage from './HabitsPage'


class App extends Component {

  render() {
    return (
      <Router>
        <Switch>
          <Route exact path="/" component={HomePage}/>
          <Route exact path="/register" component={RegistrationPage}/>
          <Route exact path="/login" component={LoginPage}/>
          <Route exact path="/habits" component={HabitsPage}/>
        </Switch>
      </Router>
    );
  }
}

export default App;
