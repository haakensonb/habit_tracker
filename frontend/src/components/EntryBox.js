import React, { Component } from 'react';
import moment from 'moment';

class EntryBox extends Component {
  constructor(props) {
    super(props);

    this.state = {
      status: this.props.status
    }

    this.toggleStatus = this.toggleStatus.bind(this);
    this.changeEntry = this.changeEntry.bind(this);
  }

  changeEntry(newStatus) {
    const id = this.props.id;
    const url = `http://127.0.0.1:5000/api/entry/${id}`;

    const data = {
      status: newStatus,
      entry_day: this.props.entryDay
    }
    fetch(url, {
      method: 'PUT',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.props.authToken}`
      }
    })
    .then(res => res.json())
    .then(data => {
      // console.log(data)
      
      this.setState({
        status: data.status
      })
      // this will update the state of the entries on the HabitDetail component
      this.props.updateEntriesState(this.props.id, data.status)
    })
  }

  toggleStatus(event) {
    event.preventDefault();
    if (this.state.status === 'complete'){
      this.changeEntry('failed');
    } else if (this.state.status === 'failed') {
      this.changeEntry('empty');
    } else if (this.state.status === 'empty'){
      this.changeEntry('complete');
    }
  }
  
  render() {
    const entryDay = moment(this.props.entryDay).format('L');
    return (
      <div>
        <p>Entry</p>
        <p>Day: {entryDay}</p>

      <button onClick={this.toggleStatus}>
        status: {this.state.status}
      </button>

      </div>
    );
  }

}


export default EntryBox;