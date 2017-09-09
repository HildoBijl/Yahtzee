import './Settings.css'

import React, { Component } from 'react'
import { connect } from 'react-redux'

class Settings extends Component {
  render() {
    return (
      <div className="page settings">
        <p>This is the settings page. [ToDo: build this.]</p>
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
)(Settings)
