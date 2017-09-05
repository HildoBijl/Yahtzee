import './App.css'

import React, { Component } from 'react'
import { connect } from 'react-redux'

import firebase from '../../config/firebase.js'
import logo from '../../logo.svg'

import Yahtzee from '../Yahtzee/Yahtzee.js'

// TODO: SORT OUT FILE.

// firebase.auth().getRedirectResult().then((result) => {
//   // console.log('Stuff happened')
//   // console.log(firebase.auth().currentUser)
//   // if (result.credential) {
//     // This gives you a Google Access Token. You can use it to access the Google API.
//     // var token = result.credential.accessToken
//     // ...
//     // console.log('Succes! ' + token)
//   // }

//   // The signed-in user info.
//   // var user = result.user
//   // console.log(user)
//   // console.log(user.displayName)
//   // console.log(user.email)
//   // console.log(user.uid)
// }).catch((error) => {
//   // console.log('Error happened')
//   // Handle Errors here.
//   // var errorCode = error.code
//   // var errorMessage = error.message
//   // The email of the user's account used.
//   // var email = error.email
//   // The firebase.auth.AuthCredential type that was used.
//   // var credential = error.credential
//   // console.log(errorCode +':'+errorMessage+':' + email + ':' + credential)
//   // console.log(credential)
//   // ...
// })

export default class App extends Component {
  // constructor() {
  //   super()
  //   this.state = {
  //     user: null
  //   }
  // }
  // componentWillMount() {
  //   firebase.auth().onAuthStateChanged(() => {
  //     // console.log('Now we are ready')
  //     const user = firebase.auth().currentUser
  //     if (user) {
  //       // console.log('Logged in!')
  //       this.setState({
  //         user: {
  //           name: user.displayName,
  //           email: user.email,
  //           uid: user.uid,
  //         }
  //       })
  //     } else {
  //       // console.log('Logged out!')
  //       this.setState({
  //         user: null
  //       })
  //     }
  //   })
  // }
  // signInGoogle() {
  //   let provider = new firebase.auth.GoogleAuthProvider()
  //   firebase.auth().signInWithRedirect(provider)
  //     .then((user) => {
  //       // console.log('Log in success G')
  //       // console.log(user)
  //     })
  //     .catch((err) => {
  //       // console.log('Log in failed G')
  //       // console.log(err)
  //     })
  // }
  // signInFacebook() {
  //   var provider = new firebase.auth.FacebookAuthProvider()
  //   firebase.auth().signInWithRedirect(provider)
  //     .then((user) => {
  //       // console.log('Log in success F')
  //       // console.log(user)
  //     })
  //     .catch((err) => {
  //       // console.log('Log in failed F')
  //       // console.log(err)
  //     })
  // }
  // // async signOut() {
  // //   await firebase.auth().signOut()
  // //   this.setState({user: null})
  // // }
  // signOut() {
  //   firebase.auth().signOut()
  // }
  render() {
    return (
      <div className="app container-fluid">
        <Yahtzee />
        {/* <p className="App-intro">
          {this.state.user ? 'You are logged in as ' + this.state.user.name + '.' : 'You are not logged in now.'}
        </p>
        {this.state.user ? (
          <p onClick={this.signOut}>
            Log me out!
          </p>
        ) : (
          <div>
            <p onClick={this.signInGoogle}>
              Log in with Google
            </p>
            <p onClick={this.signInFacebook}>
              Log in with Facebook
            </p>
          </div>
        )} */}
      </div>
    )
  }
}
