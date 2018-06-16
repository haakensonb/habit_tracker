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
      entries: [],
      message: ''
    }

    this.id = this.props.match.params.id;
    this.url = `http://127.0.0.1:5000/api/habits/${this.id}`;

    this.deleteHabit = this.deleteHabit.bind(this);
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
          name: data.name
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

  render() {
    const entries = this.state.entries.map((entry) => {
      return (
        <EntryBox 
        status={entry.status}
        key={entry.id}
        id={entry.id}
        entryDay={entry.entry_day}
        authToken={this.props.authToken}
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
    authToken: state.loginReducer.authToken
  }
}

// need to use withRouter so that we have access to url parameters in react router
export default withRouter(
  connect(mapStateToProps)(HabitDetail)
);