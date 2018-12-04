import './About.css'

import React, { Component } from 'react'

export default class About extends Component {
  render() {
    return (
      <div className="page about">
        <p className="introQuote">I always wondered if you could quantify luck. Guess I found the answer.</p>
        <p>My name is <a href="http://www.hildobijl.com/" target="_blank" rel="noopener noreferrer">Hildo Bijl</a>, and I made this game as a hobby project. Its goal was to answer three questions that rose out of curiosity.</p>
        <ul>
          <li>Can you analytically solve a game like Yahtzee, without requiring years of calculations? (Yes, it took my script only a few hours.)</li>
          <li>If you take a game with random elements, like Yahtzee, can you quantify how much luck you have? (This app proves that you can.)</li>
          <li>If you get direct feedback on your moves, does that make the game more or less fun to play? (More fun initially, and awfully boring later on, as you may find out for yourself.)</li>
        </ul>
        <p>As software projects go, it was originally planned with a ton of extra features that never made it. Some examples include ...</p>
        <ul>
          <li>detailed <em>report cards</em> providing feedback on how you played each game and where you can improve.</li>
          <li><em>luck stabilization</em>: slightly adjusting rolls to make sure the overall 'luck' you have in a game is closer to zero, making the game more based on skill and less on luck.</li>
          <li>a <em>machine learning</em> algorithm that doesn't learn the perfect moves, but learns <em>your</em> moves: the kind of choices <em>you</em> would make. You can then have the algorithm play the simple obvious moves for you, saving the difficult (read: interesting) decisions for yourself.</li>
        </ul>
        <p>If you're excited about one of these features, <a href="http://www.hildobijl.com/Contact.php" target="_blank" rel="noopener noreferrer">drop me a note</a> and maybe I'll end up implementing it after all.</p>
      </div>
    )
  }
}