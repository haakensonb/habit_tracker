import React, {Component} from 'react'

class LoginForm extends Component {
    constructor(props) {
      super(props);
      this.state = {
        username: '',
        password: ''
      }
  
      this.handleChange = this.handleChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
    }
  
    handleChange(event) {
      const value = event.target.value;
      const name = event.target.name;
  
      this.setState({
        [name]: value
      })
    }
  
    handleSubmit(event) {
      console.log("You are logged in")
      event.preventDefault();
    }
  
    render() {
      return (
        <form onSubmit={this.handleSubmit}>
          <label>
            Username
            <input type="text" name="username" value={this.state.username} onChange={this.handleChange}/>
          </label>
          <br />
          <label>
            Password
            <input type="password" name="password" value={this.state.password} onChange={this.handleChange}/>
          </label>
          <br/>
          <input type="submit" value="Submit"/>
        </form>
      )
    }
  }
  
  export default LoginForm;