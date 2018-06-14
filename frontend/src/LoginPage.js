import React, {Component} from 'react'
import NavBar from './NavBar'
import LoginForm from './LoginForm'

class LoginPage extends Component {
  render() {
    return (
      <div className='container'>
        <NavBar />
        <p>
          This is the login page.
        </p>
        <LoginForm />
      </div>
    )
  }
}

export default LoginPage;