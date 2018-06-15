import React, {Component} from 'react'
import { registerAync } from '../redux/actions';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

class RegistrationForm extends Component {
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
      this.props.register(this.state.username, this.state.password);
    } else {
      console.log("Passwords don't match");
    }
    event.preventDefault();
  }

  render() {
    // if the redux store shows that the user is authenticated
    // that means they have already logged in and we can redirect them
    if (this.props.isAuthenticated) {
      return <Redirect to='/habits' />
    }

    if (this.props.isFetching) {
      return <div>LOADING...</div>
    }

    return (
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
    )
  }
}

const mapStateToProps = (state) => {
  return {
    isFetching: state.loginReducer.isFetching,
    isAuthenticated: state.loginReducer.isAuthenticated
  }
}

const mapDispatchToProps = dispatch => {
  return {
    register: (username, password) => dispatch(registerAync(username, password))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(RegistrationForm);