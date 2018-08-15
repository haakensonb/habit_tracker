import React, {Component} from 'react'
import { setAuthData} from '../redux/actions';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

class LoginForm extends Component {
    constructor(props) {
      super(props);
      this.state = {
        username: '',
        password: '',
        shouldRedirect: false
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
      const url = 'http://127.0.0.1:5000/auth/login';
      this.props.login(url, this.state.username, this.state.password)
      event.preventDefault();
    }
  
    render() {
      // if the redux store shows that the user is authenticated
      // that means they have already logged in and we can redirect them
      if (this.props.isAuthenticated) {
        return <Redirect to='/habits' />
      }

      if (this.props.isFetching) {
        return (<section className='section hero is-medium'>
          <div className='hero-body'>
            <h1 className='title'>
              LOADING... <a className='button is-info is-loading' href='#'>I am still loading</a>
            </h1>
          </div>
        </section>)
      }

      return (
        <section className='section'>
        <h3 className='title'>Login</h3>
        <form onSubmit={this.handleSubmit}>
          <div className='field'>
            <label className='label'>
            Username
            <div className='control'>
              <input className='input' type="text" name="username" value={this.state.username} onChange={this.handleChange}/>
            </div>
            </label>
          </div>

          <div className='field'>
            <label className='label'>
            Password
            <div className='control'>
              <input className='input' type="password" name="password" value={this.state.password} onChange={this.handleChange}/>
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
    login: (url, username, password) => dispatch(setAuthData(url, username, password))
  }
}
  
export default connect(mapStateToProps, mapDispatchToProps)(LoginForm)