import './Dice.css'

import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import classnames from 'classnames'

import gameActions from '../../redux/gameState.js'
import { isAFieldSelected, getDicePositionInCategory, canClickOnDice } from '../../redux/gameState.js'
import { createAscendingArray } from '../../logic/util.js'
import yana from '../../logic/yahtzeeAnalysis.js'

class Dice extends Component {
  render() {
    const gs = this.props.gameState
    const index = this.props.index
    const number = isAFieldSelected(gs) ? -1 : gs.dice[index] // -1 means an unknown number.
    const selected = !isAFieldSelected(gs) && gs.selectedDice[index]
    const rollsLeft = isAFieldSelected(gs) ? yana.numRolls : gs.rollsLeft
    const active = canClickOnDice(gs)
    return (
      <li
        className={classnames(
          'dice',
          'dice' + index,
          number <= 0 ? 'noNumber' : ('number' + number),
          (selected ? 'selected' : 'unselected') + getDicePositionInCategory(gs, index),
          'rollsLeft' + rollsLeft,
          {active},
        )}
        onClick={active ? () => this.props.clickDice(index) : null}
      >
        <div className="diceContents">
          {createAscendingArray(1, yana.numSides).map((ind) => <span key={ind} className={classnames("dot", "dot"+ind)} />)}
        </div>
      </li>
    )
  }
}

export default connect(
  function mapStateToProps(state) {
    return {
      gameState: state.gameState
    }
  },
  function mapDispatchToProps(dispatch) {
    return {
      clickDice: (ind) => dispatch(gameActions.clickDice(ind)),
    }
  }
)(Dice)

Dice.propTypes = {
  index: PropTypes.number.isRequired,
}
