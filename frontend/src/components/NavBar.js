import React, { Component } from 'react';
import {Link} from 'react-router-dom'
import { connect } from 'react-redux';


class NavBar extends Component {
  constructor(props) {
    super(props);
    this.toggleClass = this.toggleClass.bind(this);
    this.state = {
      active: false,
    }
  }

  toggleClass() {
    const currState = this.state.active;
    this.setState({active: !currState})
  }

  render() {
    const isAuthenticated = this.props.isAuthenticated;
    const username = this.props.username;
    const activeClass = this.state.active ? 'is-active': '';
    return (
      <nav>
        {isAuthenticated ? (
          <LoggedInLinks username={username} activeClass={activeClass} toggleClass={this.toggleClass}/>
        ): (
          <NotLoggedInLinks activeClass={activeClass} toggleClass={this.toggleClass}/>
        )}
      </nav>
    )
  }
}


const NotLoggedInLinks = (props) => {
  return (
    <nav className='navbar' aria-label='main navigation'>
      <div className='navbar-brand'>
        <Link className="navbar-item" to="/">Habit Tracker</Link>
        <a onClick={props.toggleClass} role="button" className={`navbar-burger ${props.activeClass}`} aria-label="menu" aria-expanded="false">
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
        </a>
      </div>
      <div className={`navbar-menu ${props.activeClass}`}>
        <div className='navbar-end'>
          <Link onClick={props.toggleClass} className='navbar-item' to="/">Home</Link>
          <Link onClick={props.toggleClass} className='navbar-item' to="/register">Register</Link>
          <Link onClick={props.toggleClass} className='navbar-item' to="/login">Login</Link>
        </div>
      </div>
    </nav>
  )
}


const LoggedInLinks = (props) => {
  return (
    <nav className='navbar' aria-label='main navigation'>
      <div className='navbar-brand'>
        <Link className="navbar-item" to="/">Habit Tracker</Link>
        <a onClick={props.toggleClass} role="button" className={`navbar-burger ${props.activeClass}`} aria-label="menu" aria-expanded="false">
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
        </a>
      </div>
      <div className={`navbar-menu ${props.activeClass}`}>
        <div className='navbar-end'>
          <p className='navbar-item'>You are logged in as {props.username}</p>
          <Link onClick={props.toggleClass} className='navbar-item' to="/">Home</Link>
          <Link onClick={props.toggleClass} className='navbar-item' to="/habits">Habits</Link>
          <Link onClick={props.toggleClass} className='navbar-item' to="/logout">Logout</Link>
        </div>
      </div>
    </nav>
  )
}


const mapStateToProps = (state) => {
  return {
    isAuthenticated: state.authReducer.isAuthenticated,
    username: state.authReducer.username
  }
}


export default connect(mapStateToProps)(NavBar);