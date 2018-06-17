import React, {Component} from 'react'
import Habit from './Habit'
import { connect } from 'react-redux';
import HabitForm from './HabitForm';
import moment from 'moment';

class HabitList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      habits: [],
      name: '',
      description: '',
      startDate: moment()
    }

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleDateChange = this.handleDateChange.bind(this);
  }

  handleChange (event) {
    const value = event.target.value;
    const name = event.target.name;

    this.setState({
      [name]: value
    });
  }

  handleDateChange(date) {
    this.setState({
      startDate: date
    })
  }

  handleSubmit (event) {
    event.preventDefault();
    
    const url = 'http://127.0.0.1:5000/api/habits/';
    const data = {
      name: this.state.name,
      description: this.state.description,
      start_date: this.state.startDate.format('L')
    }
    const authToken = this.props.authToken;
    fetch(url, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      }
    })
    .then(res => res.json())
    .then(data => {
      // have to use concat to add data to habits
      // because react state is immutable
      const newData = this.state.habits.concat(data);
      this.setState({
        habits: newData
      })
    })

  }

  componentDidMount() {
    const url = 'http://127.0.0.1:5000/api/habits/';
    
    fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.props.authToken}`
      }
    })
    .then(res => res.json())
    .then((data) => {
      this.setState({
        habits: [...data]
      })
      console.log(data)
    })
  }

  render() {
    const habits = this.state.habits.map((habit) => {
      return (<Habit 
        key={habit.id}
        id={habit.id}
        name={habit.name}
        description={habit.description}
        entries={habit.entries}
        startDate={moment(habit.start_date).format('L')}
        />
    )});

    return (
      <div>

        <HabitForm
        title="Add a new habit"
        handleSubmit={this.handleSubmit}
        name={this.state.name}
        handleChange={this.handleChange}
        description={this.state.description}
        startDate={this.state.startDate}
        handleDateChange={this.handleDateChange}
        />

        {habits}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    authToken: state.loginReducer.authToken
  }
}


export default connect(mapStateToProps)(HabitList)