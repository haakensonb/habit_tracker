import React, {Component} from 'react'
import NavBar from '../components/NavBar'

class HomePage extends Component {
  render() {
    return (
      <div className='container'>
        <NavBar />
        <p>
          This is the hompage.
        </p>
      </div>
    )
  }
}

export default HomePage;