import React, { Component } from 'react';
import moment from 'moment';
import axiosInstance from '../utils/axiosInstance';

class EntryBox extends Component {
  constructor(props) {
    super(props);

    // use variables for color class so that they only have to be
    // altered in one place if they need to be changed
    this.emptyColor = 'has-background-grey-light';
    this.completeColor = 'has-background-success';
    this.failedColor = 'has-background-danger';

    // Need to create a colorClass variable and set it according
    // to whatever the status is. Otherwise when reloading the page the color will
    // not reflect the actual status.
    let colorClass = '';
    if (this.props.status === 'X') {
      colorClass = this.completeColor;
    } else if (this.props.status === 'O') {
      colorClass = this.failedColor;
    } else {
      colorClass = this.emptyColor;
    }

    this.state = {
      status: this.props.status,
      colorClass: colorClass
    }

    this.toggleStatus = this.toggleStatus.bind(this);
    this.changeEntry = this.changeEntry.bind(this);
  }

  changeEntry(newStatus, colorClass) {
    const id = this.props.id;
    const url = `http://127.0.0.1:5000/api/entry/${id}`;

    const data = {
      status: newStatus,
      entry_day: this.props.entryDay
    }

    axiosInstance.put(url, data).then(res => {
      
      this.setState({
        status: res.data.status,
        colorClass: colorClass
      })
      // this will update the state of the entries on the HabitDetail component
      this.props.updateEntriesState(this.props.id, res.data.status)
    })
  }

  toggleStatus(event) {
    event.preventDefault();
    if (this.state.status === 'X'){
      this.changeEntry('O', this.failedColor);
    } else if (this.state.status === 'O') {
      this.changeEntry('\u00a0', this.emptyColor);
    } else if (this.state.status === '\u00a0'){
      this.changeEntry('X', this.completeColor);
    }
  }
  
  render() {
    const entryDay = moment(this.props.entryDay).utc().format('L');
    return (
      <div className='card item'>
      <div className={`card-content is-size-4 has-text-white has-text-centered ${this.state.colorClass}`} onClick={this.toggleStatus}>
          {this.state.status}
      </div>
      

      <footer className='card-footer'>
        <time className='card-footer-item'>{entryDay}</time>
      </footer>

      </div>
    );
  }

}


export default EntryBox;