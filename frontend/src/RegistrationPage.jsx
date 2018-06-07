import React, {Component} from 'react'
import NavBar from './NavBar'

class RegistrationPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      passwordConfirm: ''
    }

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    const value = event.target.value;
    const name = event.target.name;

    // brackets are for ES6 computed property name
    this.setState({
      [name]: value
    })
  }

  handleSubmit(event) {
    if (this.state.password === this.state.passwordConfirm) {
      console.log("Registered");
    } else {
      console.log("Passwords don't match");
    }
    console.log(this.state)
    event.preventDefault();
  }

  render() {
    return (
      <div className='container'>
        <NavBar />
        <p>
          This is the registration page
        </p>
        <form onSubmit={this.handleSubmit}>
          <label>
            Username
            <input type="text" name="username" values={this.state.username} onChange={this.handleChange}/>
          </label>
          <br />
          <label>
            Password
            <input type="password" name="password" values={this.state.password} onChange={this.handleChange}/>
          </label>
          <br />
          <label>
            Confirm Password
            <input type="password" name="passwordConfirm" values={this.state.passwordConfirm} onChange={this.handleChange}/>
          </label>
          <br />

          <input type="submit" value="Submit"/>
        </form>
      </div>
    )
  }
}

export default RegistrationPage;