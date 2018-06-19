import React, {Component} from 'react'
import NavBar from '../components/NavBar'
import LoginForm from '../components/LoginForm'
import {ToastContainer} from 'react-toastify';

class LoginPage extends Component {
  render() {
    return (
      <div className='container'>
        <NavBar />
        <ToastContainer />
        <p>
          This is the login page.
        </p>
        <LoginForm />
      </div>
    )
  }
}

export default LoginPage;