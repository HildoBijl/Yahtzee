import './Account.css'

import React, { Component } from 'react'
import { connect } from 'react-redux'

class Account extends Component {
  render() {
    return (
      <div className="page account">
        <p>This is the account page. [ToDo: build this.]</p>
      </div>
    )
  }
}

export default connect(
  function mapStateToProps(state) {
    return {}
  },
  function mapDispatchToProps(dispatch) {
    return {}
  }
)(Account)
