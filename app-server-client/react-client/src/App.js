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
    var sidebarContent = <b>Sidebar content</b>
    var sidebarProps = {
      sidebar: this.state.sidebarOpen,
      docked: this.state.sidebarDocked,
      onSetOpen: this.onSetSidebarOpen
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
          <Map
            zoom={12}
            center={{ lat: 34.0162932, lng: -118.3908012 }}
            containerElement={<div style={{ height: `500px` }} />}
            mapElement={<div style={{ height: `500px` }} />} />
        </div>
    )
  }
}

export default App
