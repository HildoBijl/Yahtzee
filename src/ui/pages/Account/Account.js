import './Account.css'

import React, { Component } from 'react'
import { connect } from 'react-redux'
import classnames from 'classnames'

import userActions from '../../../redux/user.js'
import { isSignedIn, isFirebaseReady } from '../../../redux/user.js'

import Dice from '../../components/Dice/Dice.js'

const hideNotificationAfter = 6000

class Account extends Component {
  getNotification() {
    // Check if there is a valid notification.
    const notification = this.props.user.notification
    if (!notification || new Date() - notification.date > hideNotificationAfter)
      return ''
    return <p key={Math.random()} className={classnames("notification", notification.type)}>{this.props.user.notification.message}</p>
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
    // ToDo: set up a proper loading indicator.
    return (
      <div className="page account">
        {this.getNotification()}
        <div className="loadingIndicator">
          <Dice />
          <span className="loadingMessage">Accessing server...</span>
        </div>
      </div>
    )
  }
  renderSignInPage() {
    // ToDo: add reasons why you would want an account.
    return (
      <div className="page account">
        {this.getNotification()}
        <div className="signInButtons">
          <div className="btn redirectLogin" onClick={() => this.props.signInGoogle(true)}>Google sign-in</div>
          <div className="btn redirectLogin" onClick={() => this.props.signInFacebook(true)}>Facebook sign-in</div>
          <div className="btn popupLogin" onClick={() => this.props.signInGoogle(false)}>Google sign-in</div>
          <div className="btn popupLogin" onClick={() => this.props.signInFacebook(false)}>Facebook sign-in</div>
        </div>
        <p className="signInReasons">Signing in has various benefits.</p>
        <ul className="signInReasonList">
          <li>Keep track of statistics.</li>
          <li>Share settings across devices.</li>
          <li>Predictive mode (still under development).</li>
        </ul>
      </div>
    )
  }
  renderAccountPage() {
    // ToDo: add statistics.
    const user = this.props.user
    return (
      <div className="page account">
        {this.getNotification()}
        <div className="signedInNote">
          <span className="signedInMessage">Signed in as {user.name}.</span>
          <div className="btn" onClick={this.props.signOut}>Sign out</div>
        </div>
        <p>Statistics will be visible here soon. I'm still working on that.</p>
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
      signInGoogle: (redirect) => dispatch(userActions.signInGoogle(redirect)),
      signInFacebook: (redirect) => dispatch(userActions.signInFacebook(redirect)),
      signOut: () => dispatch(userActions.signOut()),
    }
  }
)(Account)
