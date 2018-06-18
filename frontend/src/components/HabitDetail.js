import React, { Component } from 'react';
import connect from 'react-redux/lib/connect/connect';
import { withRouter } from 'react-router-dom';
import EntryBox from './EntryBox';
import Link from 'react-router-dom/Link';

class HabitDetail extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: '',
      description: '',
      entries: [],
      message: ''
    }

    this.id = this.props.match.params.id;
    this.url = `http://127.0.0.1:5000/api/habits/${this.id}`;

    this.deleteHabit = this.deleteHabit.bind(this);
    this.getHighestStreak = this.getHighestStreak.bind(this);
    this.updateEntriesState = this.updateEntriesState.bind(this);
  }

  componentDidMount() {
    fetch(this.url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.props.authToken}`
      }
    })
    .then(res => res.json())
    .then((data) => {
      const newData = data.entries;
      console.log(newData);
      if (newData){
        this.setState({
          entries: [...newData],
          name: data.name,
          description: data.description
        })
        console.log(data)
      } else{
        this.setState({
          message: data.message
        })
      }
      
    })
  }

  deleteHabit(event) {
    event.preventDefault();
    const confirmed = window.confirm("Are you sure you want to delete this habit?")
    if (confirmed){
      fetch(this.url, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.props.authToken}`
        }
      })
      .then(() => {
        // redirect back to habits page
        this.props.history.push('/habits')
      })
    }

  }

  // this can be passed down into EntryBox so that when an entry's status is updated
  // the status of that entry will also be updated on this component
  // status needs to be known to this component so that a streak can be calculated
  updateEntriesState(id, newStatus) {
    const entryId = this.state.entries.findIndex(x => x.id === id);
    let newEntries = this.state.entries;
    newEntries[entryId].status = newStatus;
    this.setState({
      entries: newEntries
    })
  }

  getHighestStreak(entries) {
    let streak = 0;
    let highestStreak = 0;
    entries.forEach((entry) => {
      if (entry.status === 'complete'){
        streak += 1;
        if (streak > highestStreak){
          highestStreak = streak;
        }
      } else {
        streak = 0;
      }
    });
    return highestStreak;
  }

  render() {
    console.log(this.state.entries)

    const entries = this.state.entries.map((entry) => {
      return (
        <EntryBox 
        status={entry.status}
        key={entry.id}
        id={entry.id}
        entryDay={entry.entry_day}
        authToken={this.props.authToken}
        updateEntriesState={this.updateEntriesState}
        />
      );
    });


    if (this.state.message) {
      return (
        <div>
          ERROR: {this.state.message}
        </div>
      );
    }
    
    return (
      <div>
        <p>Habit: {this.state.name}</p>
        <p>description: {this.state.description}</p>
        <p>Highest Streak: {this.getHighestStreak(this.state.entries)}</p>
        <button><Link to={`/habit/edit/${this.id}`}>Edit this habit</Link></button>
        <br />
        <button onClick={this.deleteHabit}>Delete this habit</button>
        {entries}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    authToken: state.authReducer.authToken
  }
}

// need to use withRouter so that we have access to url parameters in react router
export default withRouter(
  connect(mapStateToProps)(HabitDetail)
);