import React, { Component } from 'react'
import { withGoogleMap, GoogleMap, Marker } from 'react-google-maps'
import axios from 'axios'
import './App.css'
import clientAuth from './clientAuth'
import SignUp from './components/SignUp'
import LogIn from './components/LogIn'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import Map from './components/Map.js'
//////////////////////////////////////////////////////////////
const mql = window.matchMedia(`(min-width: 800px)`)
//////////////////////////////////////////////////////////////
class App extends Component {

  constructor() {
    super()
    this.state = {
      mql: mql,
      segments: [],
      map: null,
      bounds: null,
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
//////////////////////////////////////////////////////////////
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
//////////////////////////////////////////////////////////////
  _mapLoaded(map) {
    console.log('_mapLoaded')
    if (this.state.map != null)
      return
    this.setState({
      map: map
    })
  }

  _mapMoved() {
    console.log('_mapMoved center:', JSON.stringify(this.state.map.state.map.getCenter()))

    const bounds = this.state.map.state.map.getBounds()
    const boundaryStr = `${bounds.f.b}, ${bounds.b.b}, ${bounds.f.f}, ${bounds.b.f}`

    return axios({
      url: '/api/strava/segments',
      method: 'post',
      data: {boundary: boundaryStr}
    })
    .then(res => {
      console.log(res.data.data.segments)
      this.setState({
        segments: [
          ...res.data.data.segments
        ],
        bounds: boundaryStr
      })
    })
  }

  _zoomChanged() {
    console.log('_zoomChanged:', this.state.map.getZoom())
  }
//////////////////////////////////////////////////////////////
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
              segments={this.state.segments}
              ref={this._mapLoaded.bind(this)}
              onDragEnd={this._mapMoved.bind(this)}
              onZoomChanged={this._zoomChanged.bind(this)}
              containerElement={<div style={{ height: `100%` }} />}
              mapElement={<div style={{ height: `100%` }} />}
            />
          </div>
        </div>
    )
  }
}
//////////////////////////////////////////////////////////////
export default App
