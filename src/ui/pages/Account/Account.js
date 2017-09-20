import './Account.css'

import React, { Component } from 'react'
import { connect } from 'react-redux'

import userActions from '../../../redux/user.js'
import { isSignedIn, isFirebaseReady } from '../../../redux/user.js'

class Account extends Component {
  getNotification() {
    if (!this.props.user.notification)
      return ''
    // ToDo: check notificationAt.
    return <p>{this.props.user.notification}</p>
  }
  render() {
    const user = this.props.user
    if (!isFirebaseReady(user))
      return this.renderNotReadyPage()
    else if (!isSignedIn(user))
      return this.renderSignInPage()
    return this.renderAccountPage()
  }
  renderNotReadyPage() {
    // ToDo: set up a proper 
    return (
      <div className="page account">
        {this.getNotification()}
        <p>Loading...</p>
      </div>
    )
  }
  renderSignInPage() {
    // ToDo: format buttons.
    // ToDo: add reasons why you would want an account.
    return (
      <div className="page account">
        {this.getNotification()}
        <div className="btn" onClick={this.props.signInGoogle}>Sign in with Google</div>
        <div className="btn" onClick={this.props.signInFacebook}>Sign in with Facebook</div>
      </div>
    )
  }
  renderAccountPage() {
    // ToDo: add statistics.
    const user = this.props.user
    return (
      <div className="page account">
        {this.getNotification()}
        <p>You are signed in as {user.name} &lt;{user.email}&gt;.</p>
        <div className="btn" onClick={this.props.signOut}>Sign me out!</div>
      </div>
    )
  }
}

export default connect(
  function mapStateToProps(state) {
    return {
      user: state.user,
    }
  },
  function mapDispatchToProps(dispatch) {
    return {
      signInGoogle: () => dispatch(userActions.signInGoogle()),
      signInFacebook: () => dispatch(userActions.signInFacebook()),
      signOut: () => dispatch(userActions.signOut()),
    }
  }
)(Account)
