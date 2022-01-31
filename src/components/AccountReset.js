import React, {Component} from 'react'
import axiosInstance from '../utils/axiosInstance';
import { addMessage } from '../redux/actions';
import { showMessage } from '../utils/showMessage';
import connect from 'react-redux/lib/connect/connect';
import baseURL from '../utils/baseURL';

class AccountReset extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: ''
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
    const url = `${baseURL}/auth/account_reset`;
    const data = {
      email: this.state.email
    }
    axiosInstance.post(url, data).then((res) => {
      const message = res.data.message;
      this.props.addMessage(message, 'success');
      showMessage();
    })
    event.preventDefault();
  }

  render() {

    return (
      <section className='section'>
        <h3 className='title'>Reset Password</h3>
        <p className='subtitle'>Reset link will be sent to your email</p>
        <form onSubmit={this.handleSubmit}>
          <div className='field'>
            <label className='label'>
            Email
            <div className='control'>
              <input className='input' type="email" name="email" value={this.state.email} onChange={this.handleChange}/>
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

export default connect(null, mapDispatchToProps)(AccountReset);