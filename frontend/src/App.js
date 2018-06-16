import React, { Component } from 'react';
import './App.css';
import {
  BrowserRouter as Router,
  Route,
  Switch
} from 'react-router-dom';
import HomePage from './pages/HomePage';
import RegistrationPage from './pages/RegistrationPage';
import LoginPage from './pages/LoginPage';
import HabitsPage from './pages/HabitsPage';
import LogoutPage from './pages/LogoutPage';
import HabitDetailPage from './pages/HabitDetailPage';
import requireAuth from './utils/requireAuth';

class App extends Component {

  render() {
    return (
      <Router>
        <Switch>
          <Route exact path="/" component={HomePage}/>
          <Route exact path="/register" component={RegistrationPage}/>
          <Route exact path="/login" component={LoginPage}/>
          <Route exact path="/habits" component={requireAuth(HabitsPage)}/>
          <Route exact path="/habit/:id" component={requireAuth(HabitDetailPage)} />
          <Route exact path="/logout" component={requireAuth(LogoutPage)}/>
        </Switch>
      </Router>
    );
  }
}



export default App;
