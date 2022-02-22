import React, {Component} from 'react'
import Redirect from 'react-router-dom/Redirect';
import connect from 'react-redux/lib/connect/connect';

// Not entirely sure that I understand this yet but I will attempt
// to explain it to myself.
// I used these two links for reference:
// https://reactjs.org/docs/higher-order-components.html
// https://stackoverflow.com/questions/46379934/react-router-v4-authorized-routes-with-hoc

// This is a react higher order component.
// It is a function that will take in a component and wrap
// some other functionality around it before returning.

export default function requireAuth (WrappedComponent) {
  // Creates an authentication class which receives the isAuthenticated prop
  class Authentication extends Component {
    render() {
      // if the user is not authenticated
      if (!this.props.isAuthenticated) {
        // redirect them to the login page
        return <Redirect to="/login" />
      }
      // otherwise just return the component that was passed in
      // continue to pass all props from this component down to the WrappedComponent
      return <WrappedComponent { ...this.props } />
    }
  }

  // Specify that we want to get isAuthenticated from the store
  // and then map it to the prop isAuthenticated
  const mapStateToProps = (state) => {
    return {
      isAuthenticated: state.authReducer.isAuthenticated
    }
  }

  // connect this prop to redux so it has access to the store and then return it
  return connect(mapStateToProps)(Authentication)
}