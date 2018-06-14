import React, {Component} from 'react'
import NavBar from '../components/NavBar'
import RegistrationForm from '../components/RegistrationForm';

class RegistrationPage extends Component {
  render() {
    return (
      <div className='container'>
        <NavBar />
        <p>
          This is the registration page
        </p>
        <RegistrationForm />
      </div>
    )
  }
}

export default RegistrationPage;