import React, {Component} from 'react'
import NavBar from '../components/NavBar'
import HabitDetail from '../components/HabitDetail';

class HabitDetailPage extends Component {
  render() {
    return (
      <div className='container'>
        <NavBar />
        <p>This is the habit detail page</p>
        <HabitDetail />
      </div>
    );
  }
}

export default HabitDetailPage;