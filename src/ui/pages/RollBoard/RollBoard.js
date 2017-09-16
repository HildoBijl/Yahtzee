import './RollBoard.css'

import React, { Component } from 'react'
import { connect } from 'react-redux'
import classnames from 'classnames'

import gameActions from '../../../redux/gameState.js'
import { isGameJustStarting, getNumSelectedDice, enableRollButton, canRollDice, getExpectedScoreOfRoll, getExpectedScoreOfChoice } from '../../../redux/gameState.js'
import { roundToDigits, roundToSignificantDigits } from '../../../logic/util.js'

import Dice from '../../components/Dice/Dice.js'

class RollBoard extends Component {
  rollDice() {
    if (canRollDice(this.props.gameState))
      this.props.rollDice()
  }

  render() {
    const gs = this.props.gameState

    // Evaluate the state we're in and how lucky that is.
    const expectedRollScore = getExpectedScoreOfRoll(gs)
    const luckEffectKnown = (gs.expectedScoreBeforeRoll !== -1 && expectedRollScore !== -1)
    const luckEffect = expectedRollScore - gs.expectedScoreBeforeRoll
    const isLucky = (luckEffect >= 0)
    const luckMessage = luckEffectKnown ? (
      'Luck: ' + (
        Math.abs(luckEffect) < 0.1 ? 
          roundToSignificantDigits(luckEffect, 1) :
          roundToDigits(luckEffect, 1)
      )
    ) : ''

    // Evaluate the choice that has been made.
    const expectedChoiceScore = getExpectedScoreOfChoice(gs)
    const choiceMade = (expectedChoiceScore !== -1) && !isGameJustStarting(gs)
    const choiceCost = expectedRollScore - expectedChoiceScore
    const isOptimalChoice = (choiceCost < 0.000001)
    const choiceMessage = choiceMade ?(
      isOptimalChoice ? 
        'Optimal' :
        'Cost: ' + (
          choiceCost < 0.1 ?
            roundToSignificantDigits(choiceCost, 1) :
            roundToDigits(choiceCost, 1)
        )
    ) : ''

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
        <span className={classnames(
          "choiceFeedback",
          {"good": choiceMade && isOptimalChoice},
          {"bad": choiceMade && !isOptimalChoice},
        )}>{choiceMessage}</span>
        <span className={classnames(
          "luckFeedback",
          {"good": luckEffectKnown && isLucky},
          {"bad": luckEffectKnown && !isLucky},
        )}>{luckMessage}</span>
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
