import React, {Component} from 'react'
import NavBar from '../components/NavBar'
import HabitList from '../components/HabitList'

class HabitsPage extends Component {
  render() {
    return (
      <div className='container'>
        <NavBar />
        <HabitList />
      </div>
    );
  }
}

export default HabitsPage;