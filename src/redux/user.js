import firebase from '../config/firebase.js'

/*
 * First, set up the actions changing things.
 */

const actions = {
	signInGoogle: () => signIn(new firebase.auth.GoogleAuthProvider()),
	signInFacebook: () => signIn(new firebase.auth.FacebookAuthProvider()),
  signOut: () => (
		(dispatch) => {
			firebase.auth().signOut()
			dispatch({ type: 'SignOut' })
		}
	),
	processAuthStateChange: () => ({
		type: 'AuthStateChange',
	}),
	processRedirectSuccess: (result) => ({
		type: 'RedirectSuccess',
		result,
	}),
	processRedirectError: (error) => ({
		type: 'RedirectError',
		error,
	}),
}

function signIn(provider) {
	return (dispatch) => {
		firebase.auth().signInWithRedirect(provider)
			.then((result) => dispatch({ type: 'RedirectSuccess', result }))
			.catch((error) => dispatch({ type: 'RedirectError', error }))
	}
}

export default actions

/*
 * Second, set up the reducer applying the actions to the state.
 */

export function reducer(user = {ready: false}, action) {
  switch (action.type) {

    case 'SignOut': {
      return {
				ready: true, 
				notification: 'You have been signed out.',
				notificationAt: new Date(),
			}
    }

    case 'AuthStateChange': {
			// Check if the user signed out. If so, delete the user but keep any potential notification.
			const firebaseUser = firebase.auth().currentUser
			if (!firebaseUser)
				return {
					ready: true,
					notification: user.notification,
					notificationAt: new Date(),
				}
			
			// The user signed in.
			return {
				ready: true,
				name: firebaseUser.displayName,
				email: firebaseUser.email,
				uid: firebaseUser.uid,
			}
		}
		
		case 'RedirectSuccess': {
			// If this was called without a user, then nothing significant happened.
			if (!action.result.user)
				return user

			// Notify the user that the sign-in was successful.
			return {
				...user,
				notification: 'You have been signed in.',
				notificationAt: new Date(),
			}
		}

		case 'RedirectError': {
			// Update the user notification to give the user some info about what happened. We may extend on this by using the error code.
			const error = action.error
			let message
			if (error.credential && error.credential.providerId && error.email)
				message = 'Could not sign in to ' + error.credential.providerId + ' with ' + error.email + '.'
			else
				message = 'Failed to sign in.'

			return {
				...user,
				notification: message + ' ' + error.message,
				notificationAt: new Date(),
			}
		}

    default: {
      return user
    }
  }
}

/*
 * Third, set up getter functions for various useful parameters.
 */

 export function isFirebaseReady(user) {
	 return user.ready
 }
 export function isSignedIn(user) {
	 return !!user.uid
 }