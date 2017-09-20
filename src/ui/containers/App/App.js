import './App.css'

import React, { Component } from 'react'
import { connect } from 'react-redux'

import firebase from '../../../config/firebase.js'
import userActions from '../../../redux/user.js'

import Yahtzee from '../Yahtzee/Yahtzee.js'

class App extends Component {
  componentWillMount() {
    firebase.auth().getRedirectResult().then(this.props.processRedirectSuccess).catch(this.props.processRedirectError)
    firebase.auth().onAuthStateChanged(this.props.processAuthStateChange)
  }
  render() {
    return (
      <div className="app container-fluid">
        <Yahtzee />
      </div>
    )
  }
}

export default connect(
  function mapStateToProps(state) {
    return {}
  },
  function mapDispatchToProps(dispatch) {
    return {
      processAuthStateChange: () => dispatch(userActions.processAuthStateChange()),
      processRedirectSuccess: (result) => dispatch(userActions.processRedirectSuccess(result)),
      processRedirectError: (error) => dispatch(userActions.processRedirectError(error)),
    }
  }
)(App)