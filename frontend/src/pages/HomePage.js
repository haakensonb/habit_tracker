import React, {Component} from 'react'
import NavBar from '../components/NavBar'
import { ToastContainer } from 'react-toastify';

class HomePage extends Component {
  render() {
    return (
      <div className='container'>
        <NavBar />
        <ToastContainer />
        <p>
          This is the hompage.
        </p>
      </div>
    )
  }
}

export default HomePage;