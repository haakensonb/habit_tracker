import React, { Component } from 'react';
import NavBar from './NavBar';
import { ToastContainer } from 'react-toastify';
import connect from 'react-redux/lib/connect/connect';
import { clearMessage } from '../redux/actions';
import { showMessage } from '../utils/showMessage';
import { withRouter } from 'react-router-dom';

class BaseLayout extends Component {
  componentDidMount() {
    if (this.props.message) {
      showMessage();
      this.props.clearMessage();
    }

  }

  render() {
    return (
      <div className='container'>
        <NavBar />
        <ToastContainer />
        { this.props.children }
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    message: state.messageReducer.message,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    clearMessage: () => {dispatch(clearMessage())}
  }
}

// need to use withRouter so that a Switch component can be rendered
// properly inside BaseLayout in App.js
export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(BaseLayout)
);