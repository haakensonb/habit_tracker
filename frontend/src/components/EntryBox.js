import React, { Component } from 'react';
import moment from 'moment';
import axiosInstance from '../utils/axiosInstance';

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

    axiosInstance.put(url, data).then(res => {
      
      this.setState({
        status: res.data.status
      })
      // this will update the state of the entries on the HabitDetail component
      this.props.updateEntriesState(this.props.id, res.data.status)
    })
  }

  toggleStatus(event) {
    event.preventDefault();
    if (this.state.status === 'X'){
      this.changeEntry('O');
    } else if (this.state.status === 'O') {
      this.changeEntry(' ');
    } else if (this.state.status === ' '){
      this.changeEntry('X');
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