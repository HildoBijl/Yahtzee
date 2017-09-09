import './RollBoard.css'

import React, { Component } from 'react'
import { connect } from 'react-redux'
import classnames from 'classnames'

import gameActions from '../../../redux/gameState.js'
import { getNumSelectedDice, enableRollButton, canRollDice } from '../../../redux/gameState.js'

import Dice from '../../components/Dice/Dice.js'

class RollBoard extends Component {  
  rollDice() {
    if (canRollDice(this.props.gameState))
      this.props.rollDice()
  }

  render() {
    const gs = this.props.gameState
    return (
      <div className={classnames("rollBoard", "selected" + getNumSelectedDice(gs))}>
        <ul className="diceContainer">
          {gs.dice.map((d,ind) => {
            return (
              <Dice
                key={ind}
                index={ind}
              />
            )}
          )}
        </ul>
        <div className="keepBar"></div>
        <span className="btn rollButton" onClick={this.rollDice.bind(this)} disabled={!enableRollButton(gs)}>Roll dice</span>
      </div>
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
      rollDice: () => dispatch(gameActions.rollDice()),
    }
  }
)(RollBoard)