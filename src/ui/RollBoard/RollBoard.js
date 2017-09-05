import './RollBoard.css'

import React, { Component } from 'react'
import { connect } from 'react-redux'
import classnames from 'classnames'

import gameActions from '../../redux/gameState.js'
import { isGameFinished, getGameScore, getNumSelectedDice, enableRollButton } from '../../redux/gameState.js'
import yana from '../../logic/yahtzeeAnalysis.js'

import Dice from '../Dice/Dice.js'

class RollBoard extends Component {
  renderFinalScreen() {
    const gs = this.props.gameState
    return (
      <div className={classnames("rollBoard", "finished")}>
        <p className="announcer">You obtained a final score of</p>
        <h3 className="finalScore">{getGameScore(gs)}</h3>
        <p className="buttonHolder"><span className="resetButton btn btn-primary" onClick={this.props.resetGame}>Play again!</span></p>
      </div>
    )
  }

  renderGameScreen() {
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
        <span className="rollButton btn btn-primary" onClick={this.props.rollDice} disabled={!enableRollButton(gs)}>Roll dice</span>
      </div>
    )
  }

  render() {
    const gs = this.props.gameState
    if (isGameFinished(gs))
      return this.renderFinalScreen()
    else
      return this.renderGameScreen()
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
      resetGame: () => dispatch(gameActions.resetGame()),
    }
  }
)(RollBoard)
