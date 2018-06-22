import React, { Component } from 'react';
import NavBar from '../components/NavBar';
import axiosInstance from '../utils/axiosInstance';

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
    axiosInstance.get(this.url).then(res => {
      this.setState({
        name: res.data.name,
        description: res.data.description
      })
      console.log(res.data)
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
    axiosInstance.put(this.url, data).then(() => {
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

export default HabitEditPage;