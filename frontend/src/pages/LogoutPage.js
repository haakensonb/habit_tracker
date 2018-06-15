import React, {Component} from 'react';
import { logoutUser, logoutUserFromApi } from '../redux/actions';
import Redirect from 'react-router-dom/Redirect';
import connect from 'react-redux/lib/connect/connect';

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
      <Redirect to="/" />
    )
  }
}

const mapStateToProps = (state) => {
  return {
    authToken: state.loginReducer.authToken,
    refreshToken: state.loginReducer.refreshToken
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    logoutUserFromApi: (authToken, refreshToken) => {dispatch(logoutUserFromApi(authToken, refreshToken))},
    logoutUser: () => {dispatch(logoutUser())}
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(LogoutPage)