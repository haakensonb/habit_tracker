import React, {Component} from 'react'
import Habit from './Habit'
import { connect } from 'react-redux';
import { ifExpiredRefreshToken } from '../utils/ifExpiredRefreshToken';

class HabitList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      habits: []
    }
  }

  componentDidMount() {
    const url = 'http://127.0.0.1:5000/api/habits/'
    const authToken = this.props.authToken
    // first need to make sure token isn't expired
    ifExpiredRefreshToken(authToken)
    // need to use then so that we are sure the token
    // is current before we start using it to call the api
    .then(
      fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        }
      })
      .then(res => {
        res.json()
        .then((data) => {
          this.setState({
            habits: [...data]
          })
        })
      })
    )
  }

  render() {
    // console.log(this.state)
    const habits = this.state.habits.map((habit) => {
      return (<Habit 
        key={habit.id}
        name={habit.name}
        description={habit.description}/>
    )});
    // console.log(habits)
    return (
      <div>
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