import React, { Component } from 'react';
import './App.css';
import {
  BrowserRouter as Router,
  Route,
  Switch
} from 'react-router-dom';
import Logout from './components/Logout';
import HabitEdit from './components/HabitEdit';
import requireAuth from './utils/requireAuth';
import 'react-toastify/dist/ReactToastify.min.css';
import BaseLayout from './components/BaseLayout';
import Home from './components/Home';
import LoginForm from './components/LoginForm';
import RegistrationForm from './components/RegistrationForm';
import HabitList from './components/HabitList';
import HabitDetail from './components/HabitDetail';
import NoMatch from './components/NoMatch';

class App extends Component {

  render() {
    return (
      <Router>
        <BaseLayout>
          <Switch>
            <Route exact path="/" component={Home}/>
            <Route exact path="/register" component={RegistrationForm}/>
            <Route exact path="/login" component={LoginForm}/>
            <Route exact path="/habits" component={requireAuth(HabitList)}/>
            <Route exact path="/habit/:id" component={requireAuth(HabitDetail)} />
            <Route exact path="/habit/edit/:id" component={requireAuth(HabitEdit)} />
            <Route exact path="/logout" component={Logout}/>
            <Route component={NoMatch} />
          </Switch>
        </BaseLayout>
      </Router>
    );
  }
}



export default App;
