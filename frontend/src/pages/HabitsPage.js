import React, {Component} from 'react'
import NavBar from '../components/NavBar'
import HabitList from '../components/HabitList'
import {ToastContainer} from 'react-toastify';

class HabitsPage extends Component {
  render() {
    return (
      <div className='container'>
        <NavBar />
        <ToastContainer />
        <HabitList />
      </div>
    );
  }
}

export default HabitsPage;