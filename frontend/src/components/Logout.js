import React, {Component} from 'react';
import { logoutUser, logoutUserFromApi } from '../redux/actions';
import connect from 'react-redux/lib/connect/connect';
import Link from 'react-router-dom/Link';

class Logout extends Component {
  componentWillMount(){
    const authToken = this.props.authToken;
    const refreshToken = this.props.refreshToken;
    // before the component mounts dispatch action creator to logout user
    // logout from api
    this.props.logoutUserFromApi(authToken, refreshToken);
    // logout from redux
    this.props.logoutUser();
    // also clear the local storage of tokens
    localStorage.clear()
  }

  render() {
    return (
      <section className='section'>
        <h3 className='title'>You are logged out</h3>
        <p><Link to='/'>Return to the homepage</Link></p>
      </section>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    authToken: state.authReducer.authToken,
    refreshToken: state.authReducer.refreshToken
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    logoutUserFromApi: (authToken, refreshToken) => {dispatch(logoutUserFromApi(authToken, refreshToken))},
    logoutUser: () => {dispatch(logoutUser())}
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Logout)