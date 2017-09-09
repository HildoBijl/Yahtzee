import './Main.css'

import React, { Component } from 'react'
import { connect } from 'react-redux'

import { isGameFinished } from '../../../redux/gameState.js'

import Menu from '../../components/Menu/Menu.js'
import RollBoard from '../../pages/RollBoard/RollBoard.js'
import EndingScreen from '../../pages/EndingScreen/EndingScreen.js'

class Main extends Component {
  render() {
    return (
      <div className="main">
        <Menu />
				{isGameFinished(this.props.gameState) ? <EndingScreen/> : <RollBoard/>}
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
    return {}
  }
)(Main)
