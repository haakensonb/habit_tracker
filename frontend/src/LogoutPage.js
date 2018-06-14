import React, {Component} from 'react';
import { logoutUser } from './redux/actions';
import Redirect from 'react-router-dom/Redirect';
import connect from 'react-redux/lib/connect/connect';

class LogoutPage extends Component {
  componentWillMount(){
    // before the component mounts dispatch action creator to logout user
    this.props.dispatch(logoutUser())
    // also clear the local storage of tokens
    localStorage.clear()
  }

  render() {
    return (
      <Redirect to="/" />
    )
  }
}

// have to use connect so that component will have access to dispatch
// but we don't actually need to map state to props at all
export default connect()(LogoutPage)