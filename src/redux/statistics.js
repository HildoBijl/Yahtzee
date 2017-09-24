import { isSignedIn } from './user.js'

/*
 * First, set up the actions changing things.
 */

const actions = {
  statisticsLoaded: (snapshot) => (
    (dispatch, getState) => dispatch({
      type: 'StatisticsLoaded',
			snapshot,
      user: getState().user,
    })
	),
}
export default actions

/*
 * Second, set up the reducer applying the actions to the state.
 */

export function reducer(statistics = getDefaultState(), action) {
  switch (action.type) {

    case 'StatisticsLoaded': {
			// If no user is logged in, then something is wrong. Ignore the call.
			if (!isSignedIn(action.user))
				return getDefaultState()

      // Extract the games from the database, put them in an array and calculate some important parameters.
      const gamesFromFirebase = action.snapshot.val()
      const games = []
      let gamesFinished = 0
      let totalScore = 0
      for (var key in gamesFromFirebase) {
        const game = gamesFromFirebase[key]
        games.push(game)
        if (game.end) {
          gamesFinished++
          totalScore+= game.score
        }
      }
      const averageScore = gamesFinished === 0 ? 0 : totalScore/gamesFinished
      return {
        games,
        gamesFinished,
        averageScore,
        loaded: true,
      }
    }

    case 'SignOut': {
			// On a user sign-out, we erase the statistics from our state.
			return getDefaultState()
    }

    default: {
      return statistics
    }
  }
}

function getDefaultState() {
	return { loaded: false }
}

/*
 * Third, set up getter functions for various useful parameters.
 */
