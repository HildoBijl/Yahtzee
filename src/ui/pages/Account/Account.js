import './Account.css'

import React, { Component } from 'react'
import { connect } from 'react-redux'
import classnames from 'classnames'

import firebase from '../../../config/firebase.js'
import userActions from '../../../redux/user.js'
import statisticsActions from '../../../redux/statistics.js'
import { isSignedIn, isFirebaseReady } from '../../../redux/user.js'
import { roundToDigits } from '../../../logic/util.js'

import Dice from '../../components/Dice/Dice.js'

const hideNotificationAfter = 6000

class Account extends Component {

  // Manage the listeners for the statistics.
  componentDidMount() {
    if (isSignedIn(this.props.user))
      this.startListeningForStatisticUpdates()
  }
  componentDidUpdate(prevProps) {
    // If the user signs in, start listening to updates from the datastore about the amount of games he has played. If he signs out, stop listening.
    if (!isSignedIn(prevProps.user) && isSignedIn(this.props.user))
      this.startListeningForStatisticUpdates()
    if (isSignedIn(prevProps.user) && !isSignedIn(this.props.user))
      this.stopListeningForStatisticUpdates()
  }
  componentWillUnmount() {
    this.stopListeningForStatisticUpdates()
  }
  
  // Manage handlers for the statistics.
  startListeningForStatisticUpdates() {
    this.firebaseRef = firebase.database().ref('games/' + this.props.user.uid)
    this.firebaseRef.on('value', this.props.statisticsLoaded)
  }
  stopListeningForStatisticUpdates() {
    if (this.firebaseRef)
      this.firebaseRef.off()
  }

  // The following functions are about rendering stuff.
  getNotification() {
    // Check if a notification exists.
    const notification = this.props.user.notification
    if (notification) {
      // Hide the notification when necessary.
      const timeUntilHide = hideNotificationAfter - (new Date() - notification.date)
      if (timeUntilHide > 0)
        setTimeout(this.forceUpdate.bind(this), timeUntilHide)

      // Give the notification HTML.
      return <p className={classnames(
        "notification",
        notification.type,
        { "hidden": timeUntilHide <= 0 }
      )}>{notification.message}</p>
    } else {
      return <p className="notification hidden"></p>
    }
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
    // ToDo: add nice statistics graphs.
    const user = this.props.user
    const statistics = this.props.statistics
    return (
      <div className="page account">
        {this.getNotification()}
        <div className="signedInNote">
          <div className="signedInID">
            <span className="signedInMessage">Signed in as <strong>{user.name}</strong>. &lt;{user.email}&gt;</span>
          </div>
          <div className="btn" onClick={this.props.signOut}>Sign out</div>
        </div>
        {statistics.loaded ? 
          <ul>
            <li>Games played: <strong>{statistics.games.length}</strong></li>
            <li>Games finished: <strong>{statistics.gamesFinished}</strong></li>
            {statistics.gamesFinished > 0 ? <li>Average score: <strong>{roundToDigits(statistics.averageScore, 1)}</strong></li> : ''}
            {statistics.gamesFinished > 0 ? <li>Best score: <strong>{statistics.bestScore}</strong></li> : ''}
            {statistics.gamesFinished > 0 ? <li>Worst score: <strong>{statistics.worstScore}</strong></li> : ''}
          </ul>
        :
          <p>Loading your statistics...</p>
        }
      </div>
    )
  }
}

export default connect(
  function mapStateToProps(state) {
    return {
      user: state.user,
      statistics: state.statistics,
    }
  },
  function mapDispatchToProps(dispatch) {
    return {
      signInGoogle: (redirect) => dispatch(userActions.signInGoogle(redirect)),
      signInFacebook: (redirect) => dispatch(userActions.signInFacebook(redirect)),
      signOut: () => dispatch(userActions.signOut()),
      statisticsLoaded: (snapshot) => dispatch(statisticsActions.statisticsLoaded(snapshot)),
    }
  }
)(Account)
