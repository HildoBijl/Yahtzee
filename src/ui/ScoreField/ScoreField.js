import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'

export default class ScoreField extends Component {
  render() {
    return (
      <div
        className={classnames(
          "entry",
          this.props.type,
          {available: this.props.available},
          {clickable: this.props.clickable},
          this.props.addClass
        )}
        onClick={this.props.callOnClick}
      >
        <div>{this.props.title}</div>
        <div>{this.props.showValue === false ? "" : this.props.value}</div>
      </div>
    )
  }
}

ScoreField.propTypes = {
  title: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
  available: PropTypes.bool,
  clickable: PropTypes.bool,
  showValue: PropTypes.bool,
  addClass: PropTypes.string,
  callOnClick: PropTypes.func,
}
