import React, {Component} from 'react'
import { withRouter } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';
import { showMessage } from '../utils/showMessage';
import { addMessage } from '../redux/actions';
import { connect } from 'react-redux';

class ResetPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      new_password: ''
    }
    this.token = this.props.match.params.token;
    this.url = 'http://127.0.0.1:5000/auth/password_reset';
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
    const data = {
      new_password: this.state.new_password,
      email_token: this.token
    }
    axiosInstance.post(this.url, data).then((res) => {
      const message = res.data.message
      this.props.addMessage(message, 'success')
      showMessage()
    })
    event.preventDefault();
  }

  render() {
    
    return (
      <section className='section'>
        <h3 className='title'>Reset Password</h3>
        <form onSubmit={this.handleSubmit}>
          <div className='field'>
            <label className='label'>
            New Password
            <div className='control'>
              <input className='input' type="password" name="new_password" value={this.state.new_password} onChange={this.handleChange}/>
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

const mapDispatchToProps = (dispatch) => {
  return {
    addMessage: (msg, type) => {
      dispatch(addMessage(msg, type))
    }
  }
}

export default withRouter(
  connect(null, mapDispatchToProps)(ResetPassword)
);