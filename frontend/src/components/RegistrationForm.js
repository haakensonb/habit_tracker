import React, {Component} from 'react'
import { setAuthDataRegistration } from '../redux/actions';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

class RegistrationForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
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
    const url = 'http://127.0.0.1:5000/auth/registration';
    if (this.state.password === this.state.passwordConfirm) {
      this.props.register(url, this.state.email, this.state.username, this.state.password);
    } else {
      window.alert("Passwords don't match");
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
      <section className='section'>
        <h1 className='title'>Register</h1>
        <form onSubmit={this.handleSubmit}>

          <div className='field'>
          <label className='label'>
            Email
            <div className='control'>
              <input className='input' type="email" name="email" values={this.state.email} onChange={this.handleChange}/>
            </div>
          </label>
          </div>

          <div className='field'>
          <label className='label'>
            Username
            <div className='control'>
              <input className='input' type="text" name="username" values={this.state.username} onChange={this.handleChange}/>
            </div>
          </label>
          </div>

          <div className='field'>
            <label className='label'>
            Password
              <div className='control'>
                <input className='input' type="password" name="password" values={this.state.password} onChange={this.handleChange}/>
              </div>
            </label>
          </div>
          
          <div className='field'>
            <label className='label'>
            Confirm Password
              <div className='control'>
                <input className='input' type="password" name="passwordConfirm" values={this.state.passwordConfirm} onChange={this.handleChange}/>
              </div>
            </label>
          </div>
          <div className='control'>
            <input className='button is-primary' type="submit" value="Submit"/>
          </div>
        </form>
      </section>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    isFetching: state.authReducer.isFetching,
    isAuthenticated: state.authReducer.isAuthenticated
  }
}

const mapDispatchToProps = dispatch => {
  return {
    register: (url, email, username, password) => dispatch(setAuthDataRegistration(url, email, username, password))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(RegistrationForm);