import React, { Component } from 'react'
import './App.css'
import clientAuth from './clientAuth'
import SignUp from './components/SignUp'
import LogIn from './components/LogIn'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import Map from './Map.js'

const mql = window.matchMedia(`(min-width: 800px)`)

class App extends Component {

  constructor() {
    super()
    this.state = {
      mql: mql,
      currentUser: null,
      loggedIn: false,
      view: 'home'
    }
  }

  componentDidMount() {
    const currentUser = clientAuth.getCurrentUser()
    this.setState({
      currentUser: currentUser,
      loggedIn: !!currentUser
    })
  }

  _signUp(newUser) {
    clientAuth.signUp(newUser).then((data) => {
      const currentUser = clientAuth.getCurrentUser()
      this.setState({
        currentUser: currentUser,
        loggedIn: !!currentUser,
        view: 'home'
      })
    })
  }

  _logIn(credentials) {
    console.log(credentials)
    clientAuth.logIn(credentials).then(user => {
      this.setState({
        currentUser: user,
        loggedIn: true,
        view: 'home'
      })
    })
  }

  _logOut() {
    clientAuth.logOut().then(message => {
      console.log(message)
      this.setState({
        currentUser: null,
        loggedIn: false,
        view: 'home'
      })
    })
  }

  _setView(evt) {
    evt.preventDefault()
    const view = evt.target.name
    this.setState({
      view: view
    })
  }

  render() {
    const location = {
      lat: 37.832429,
      lng: -122.479534
    }

    return (
        <div className="App">
          <Navbar />
          {/* <Sidebar /> */}
          <ul>
            <li><button name='signup' onClick={this._setView.bind(this)}>Sign Up</button></li>
            <li><button name='login' onClick={this._setView.bind(this)}>Log In</button></li>
            <li><button onClick={this._logOut.bind(this)}>Log Out</button></li>
          </ul>
          {{
            home: <h1>The Home View</h1>,
            login: <LogIn onLogin={this._logIn.bind(this)} />,
            signup: <SignUp onSignup={this._signUp.bind(this)} />
          }[this.state.view]}
          <div className="map-container" style={{height:'400px'}}>
            <Map
              zoom={14}
              center={location}
              containerElement={<div style={{ height: `100%` }} />}
              mapElement={<div style={{ height: `100%` }} />} />
          </div>
        </div>
    )
  }
}

export default App
