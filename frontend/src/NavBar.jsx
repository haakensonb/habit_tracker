import React, { Component } from 'react';
import {Link} from 'react-router-dom'
import { connect } from 'react-redux';


class NavBar extends Component {
  render() {
    const isAuthenticated = this.props.isAuthenticated;

    return (
      <nav>
        {isAuthenticated ? (
          <LoggedInLinks />
        ): (
          <NotLoggedInLinks />
        )}
      </nav>
    )
  }
}


const NotLoggedInLinks = (props) => {
  return (
    <ul>  
      <li><Link to="/">Home</Link></li>
      <li><Link to="/register">Register</Link></li>
      <li><Link to="/login">Login</Link></li>
    </ul>
  )
}


const LoggedInLinks = (props) => {
  return (
    <ul>
      <li><Link to="/">Home</Link></li>
      <li><Link to="/habits">Habits</Link></li>
      <li><Link to="/logout">Logout</Link></li>
    </ul>
  )
}


const mapStateToProps = (state) => {
  return {
    isAuthenticated: state.loginReducer.isAuthenticated
  }
}


export default connect(mapStateToProps)(NavBar);