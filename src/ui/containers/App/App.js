import React, { Component } from 'react'
import { connect } from 'react-redux'

import firebase from '../../../config/firebase.js'
import userActions from '../../../redux/user.js'
import statusActions from '../../../redux/status.js'
import settingActions from '../../../redux/settings.js'

import Yahtzee from '../Yahtzee/Yahtzee.js'

class App extends Component {
  componentWillMount() {
    // When the app starts to initialize, we can already call Firebase to start setting up authentication.
    firebase.auth().getRedirectResult().then(this.props.processRedirectSuccess).catch(this.props.processRedirectError)
    firebase.auth().onAuthStateChanged(this.props.processAuthStateChange)
    
    // Start up the loading of the local settings.
    this.props.loadLocalSettings()
  }
  componentDidMount() {
    // When starting the app, after the window is available, start listening for events about going online/offline.
    if (!this.updateOnlineStatus)
      this.updateOnlineStatus = () => this.props.setOnlineStatus(navigator.onLine)
    this.updateOnlineStatus()
    window.addEventListener('online',  this.updateOnlineStatus);
    window.addEventListener('offline', this.updateOnlineStatus);
  }
  componentWillUnmount() {
    // Stop listening for events about going online/offline.
    window.removeEventListener('online',  this.updateOnlineStatus);
    window.removeEventListener('offline', this.updateOnlineStatus);
  }
  render() {
    return (
      <Yahtzee />
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
      setOnlineStatus: (online) => dispatch(statusActions.setOnlineStatus(online)),
      loadLocalSettings: () => dispatch(settingActions.loadLocalSettings()),
    }
  }
)(App)