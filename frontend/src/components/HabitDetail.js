import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import EntryBox from './EntryBox';
import Link from 'react-router-dom/Link';
import axiosInstance from '../utils/axiosInstance';
import connect from 'react-redux/lib/connect/connect';
import { addMessage } from '../redux/actions';
import { showMessage } from '../utils/showMessage';

class HabitDetail extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: '',
      description: '',
      entries: [],
      wrongId: false
    }

    this.id = this.props.match.params.id;
    this.url = `http://127.0.0.1:5000/api/habits/${this.id}`;

    this.deleteHabit = this.deleteHabit.bind(this);
    this.getHighestStreak = this.getHighestStreak.bind(this);
    this.updateEntriesState = this.updateEntriesState.bind(this);
  }

  componentDidMount() {
    axiosInstance.get(this.url).then((res) => {
      const newData = res.data.entries;
      console.log(newData);
      if (newData){
        this.setState({
          entries: [...newData],
          name: res.data.name,
          description: res.data.description
        })
        console.log(res.data)
      } else{
        this.setState({
          wrongId: true
        });
        this.props.addMessage(res.data.message, 'error');
        showMessage();
      }
      
    })
  }

  deleteHabit(event) {
    event.preventDefault();
    const confirmed = window.confirm("Are you sure you want to delete this habit?")
    if (confirmed){
      axiosInstance.delete(this.url).then(() => {
        this.props.addMessage('Habit deleted', 'success');
        showMessage();
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
      if (entry.status === 'X'){
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
        updateEntriesState={this.updateEntriesState}
        />
      );
    });

    if (this.state.wrongId) {
      return (
        <div>
          <h3>
            That habit doesn't seem to exist
          </h3>
        </div>
      );
    }

    return (
      <section className='section'>
        <p>Habit: {this.state.name}</p>
        <p>description: {this.state.description}</p>
        <p>Highest Streak: {this.getHighestStreak(this.state.entries)}</p>
        <div className='buttons'>
          <Link className='button is-info' to={`/habit/edit/${this.id}`}>Edit this habit</Link>
          <button className='button is-danger' onClick={this.deleteHabit}>Delete this habit</button>
        </div>
        <div className='container'>
          <div className='wrapper'>
            {entries}
          </div>
        </div>
      </section>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    addMessage: (message, messageType) => {dispatch(addMessage(message, messageType))}
  }
}

// need to use withRouter so that we have access to url parameters in react router
export default withRouter(
  connect(null, mapDispatchToProps)(HabitDetail)
);