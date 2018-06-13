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
import HabitsPage from './HabitsPage';
import requireAuth from './requireAuth';
import LogoutPage from './LogoutPage';

class App extends Component {

  render() {
    return (
      <Router>
        <Switch>
          <Route exact path="/" component={HomePage}/>
          <Route exact path="/register" component={RegistrationPage}/>
          <Route exact path="/login" component={LoginPage}/>
          <Route exact path="/habits" component={requireAuth(HabitsPage)}/>
          <Route exact path="/logout" component={requireAuth(LogoutPage)}/>
        </Switch>
      </Router>
    );
  }
}



export default App;
