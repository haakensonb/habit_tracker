import React, { Component } from 'react';
import NavBar from './NavBar';
import { ToastContainer } from 'react-toastify';
import connect from 'react-redux/lib/connect/connect';
import { clearMessage } from '../redux/actions';
import { showMessage } from '../utils/showMessage';

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

export default connect(mapStateToProps, mapDispatchToProps)(BaseLayout);