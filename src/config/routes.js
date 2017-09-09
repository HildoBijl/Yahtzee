
import Dice from '../ui/icons/Dice.js'
import Cog from '../ui/icons/Cog.js'
import User from '../ui/icons/User.js'
import Info from '../ui/icons/Info.js'

const routes = {
  '/': {
		title: 'Yahtzee - An AI approach',
		menuLabel: 'Yahtzee',
		icon: Dice,
  },
  '/settings': {
		title: 'Yahtzee - Adjust settings',
		menuLabel: 'Settings',
		icon: Cog,
  },
  '/account': {
		title: 'Yahtzee - Account statistics',
		menuLabel: 'Account',
		icon: User,
  },
  '/about': {
		title: 'Yahtzee - About this app',
		menuLabel: 'About',
		icon: Info,
  },
};

// Append the url to the routes object.
for (var url in routes) {
  routes[url].url = url
}

export default routes