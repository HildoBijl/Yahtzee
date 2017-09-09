import './Menu.css'

import React, { Component } from 'react'
import { connect } from 'react-redux'

import User from '../../icons/User.js'
import Info from '../../icons/Info.js'
import Cog from '../../icons/Cog.js'
import Dice from '../../icons/Dice.js'
import MenuItem from './MenuItem.js'

class Menu extends Component {
  render() {
    return (
      <nav className="menu">
				<MenuItem icon={Dice} title="Yahtzee" active={true} />
				<MenuItem icon={Cog} title="Settings" active={false} />
				<MenuItem icon={User} title="Account" active={false} />
				<MenuItem icon={Info} title="About" active={false} />
      </nav>
    )
  }
}

export default connect(
  function mapStateToProps(state) {
    return {
    }
  },
  function mapDispatchToProps(dispatch) {
    return {
    }
  }
)(Menu)
