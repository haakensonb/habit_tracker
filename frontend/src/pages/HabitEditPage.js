import React, { Component } from 'react';
import NavBar from '../components/NavBar';
import { connect } from 'react-redux';

class HabitEditPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: '',
      description: ''
    }

    this.id = this.props.match.params.id;
    this.url = `http://127.0.0.1:5000/api/habits/${this.id}`;

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

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
    .then(data => {
      this.setState({
        name: data.name,
        description: data.description
      })
      console.log(data)
    })

  }

  handleChange (event) {
    const value = event.target.value;
    const name = event.target.name;

    this.setState({
      [name]: value
    });
  }


  handleSubmit(event) {
    event.preventDefault();
    const data = {
      name: this.state.name,
      description: this.state.description,
      start_date: this.state.startDate
    }
    fetch(this.url, {
      method: 'PUT',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.props.authToken}`
      }
    })
    .then(() => {
      this.props.history.push(`/habit/${this.id}`)
    })

  }

  render() {
    return (
      <div>
        <NavBar />
        <form onSubmit={this.handleSubmit}>
          <h3>Edit this habit</h3>
          <label>
            <input type="text" name="name" value={this.state.name} onChange={this.handleChange}/>
          </label>
          <br />
          <label>
            <input type="text" name="description" value={this.state.description} onChange={this.handleChange}/>
          </label>
          <br />
          <input type="submit" value="Submit"/>

        </form>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    authToken: state.authReducer.authToken
  }
}

export default connect(mapStateToProps)(HabitEditPage);