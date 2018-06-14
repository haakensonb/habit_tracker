import React, {Component} from 'react'
import { loginAsync} from '../redux/actions';
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
      this.props.login(this.state.username, this.state.password)
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

const mapStateToProps = (state) => {
  return {
    isFetching: state.loginReducer.isFetching,
    isAuthenticated: state.loginReducer.isAuthenticated
  }
}

const mapDispatchToProps = dispatch => {
  return {
    login: (username, password) => dispatch(loginAsync(username, password))
  }
}
  
export default connect(mapStateToProps, mapDispatchToProps)(LoginForm)