import React, {Component} from 'react'
import NavBar from './NavBar'

class LoginPage extends Component {
  render() {
    return (
      <div className='container'>
        <NavBar />
        <p>
          This is the login page.
        </p>
      </div>
    )
  }
}

export default LoginPage;