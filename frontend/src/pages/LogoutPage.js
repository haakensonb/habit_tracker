import React, {Component} from 'react';
import { logoutUser, logoutUserFromApi } from '../redux/actions';
import connect from 'react-redux/lib/connect/connect';
import { ToastContainer} from 'react-toastify';
import NavBar from '../components/NavBar';
import Link from 'react-router-dom/Link';

class LogoutPage extends Component {
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
      <div>
        <NavBar />
        <ToastContainer />

        <h3>You are logged out</h3>
        <p><Link to='/'>Return to the homepage</Link></p>
      </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(LogoutPage)