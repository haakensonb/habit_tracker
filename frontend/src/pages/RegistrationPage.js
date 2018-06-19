import React, {Component} from 'react'
import NavBar from '../components/NavBar'
import RegistrationForm from '../components/RegistrationForm';
import {ToastContainer} from 'react-toastify';

class RegistrationPage extends Component {
  render() {
    return (
      <div className='container'>
        <NavBar />
        <ToastContainer />
        <p>
          This is the registration page
        </p>
        <RegistrationForm />
      </div>
    )
  }
}

export default RegistrationPage;