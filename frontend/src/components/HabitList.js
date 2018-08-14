import React, {Component} from 'react'
import Habit from './Habit'
import HabitForm from './HabitForm';
import moment from 'moment';
import axiosInstance from '../utils/axiosInstance';
import connect from 'react-redux/lib/connect/connect';
import { addMessage } from '../redux/actions';
import { showMessage } from '../utils/showMessage';

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
    axiosInstance.post(url, data).then(res => {
      // have to use concat to add data to habits
      // because react state is immutable
      const newData = this.state.habits.concat(res.data);
      this.setState({
        habits: newData
      })
      this.props.addMessage('Habit added', 'success');
      showMessage();
    })

  }

  componentDidMount() {
    const url = 'http://127.0.0.1:5000/api/habits/';

    axiosInstance.get(url).then((res) => {
      this.setState({
        habits: [...res.data]
      })
      console.log(res)
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


        <section className='section'>
          {habits}
        </section>
        
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    addMessage: (message, messageType) => {dispatch(addMessage(message, messageType))}
  }
}

export default connect(null, mapDispatchToProps)(HabitList);