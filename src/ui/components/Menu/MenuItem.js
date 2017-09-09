import './MenuItem.css'

import React, { Component } from 'react'
import { connect } from 'react-redux'
import classnames from 'classnames'

import goTo from '../../../redux/router.js'

class MenuItem extends Component {
  activate() {
    this.props.goTo(this.props.page.url, this.getCurrentUrl())
  }
  getCurrentUrl() {
    return this.props.router.result ? this.props.router.result.url : '/'
  }
  isActive() {
    return this.getCurrentUrl() === this.props.page.url
  }
  render() {
    const page = this.props.page
    return (
      <div
        className={classnames(
          "menuItem",
          {active: this.isActive()},
        )}
        onClick={this.activate.bind(this)}
      >
        <page.icon />
        <div className="title">{page.menuLabel}</div>
      </div>
    )
  }
}

export default connect(
  function mapStateToProps(state) {
    return {
      router: state.router,
    }
  },
  function mapDispatchToProps(dispatch) {
    return {
      goTo: (url, currentUrl) => dispatch(goTo(url, currentUrl)),
    }
  }
)(MenuItem)
