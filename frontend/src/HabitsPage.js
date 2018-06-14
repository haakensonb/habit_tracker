import React, {Component} from 'react'
import NavBar from './NavBar'
import HabitList from './HabitList'

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