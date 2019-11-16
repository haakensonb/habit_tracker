import React, {Component} from 'react'
import { withRouter } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';
import baseURL from '../utils/baseURL';

class ConfirmEmail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      message: ''
    }
    this.token = this.props.match.params.token;
    this.url = `${baseURL}/auth/confirm_email`;
  }

  componentDidMount() {
    const data = {
      email_token: this.token
    }
    axiosInstance.post(this.url, data).then((res) => {
      const message = res.data.message;
      this.setState({
        message: message,
        isLoading: false
      })
    })
  }

  render() {
    if (this.state.isLoading === true) {
      return (<section className='section hero is-medium'>
      <div className='hero-body'>
        <h1 className='title'>
          Processing... <button className='button is-info is-loading'>I am still loading</button>
        </h1>
      </div>
    </section>
      )
    }

    return (
      <section className='section hero is-medium'>
      <div className='hero-body'>
        <h1 className='title'>
          {this.state.message}
        </h1>
      </div>
    </section>
    )
  }
}

export default withRouter(ConfirmEmail);