import './MenuItem.css'

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'

export default class MenuItem extends Component {
  render() {
		const Icon = this.props.icon
    return (
      <div
        className={classnames(
          "menuItem",
          {"active": this.props.active},
        )}
      >
        <Icon />
        <div className="title">{this.props.title}</div>
      </div>
    )
  }
}

MenuItem.propTypes = {
	icon: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  active: PropTypes.bool.isRequired,
}
