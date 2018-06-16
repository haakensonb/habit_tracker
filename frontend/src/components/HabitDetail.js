import React, { Component } from 'react';
import connect from 'react-redux/lib/connect/connect';
import { withRouter } from 'react-router-dom';
import EntryBox from './EntryBox';

class HabitDetail extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: '',
      entries: [],
      message: ''
    }
  }

  componentDidMount() {
    const id = this.props.match.params.id;
    const url = `http://127.0.0.1:5000/api/habits/${id}`;
    
    fetch(url, {
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

  render() {
    const entries = this.state.entries.map((entry) => {
      return (
        <EntryBox 
        status={entry.status}
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