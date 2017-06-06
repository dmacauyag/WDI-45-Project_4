import React, { Component } from 'react'
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
      currentSegmentElement: null,
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
    console.log('_zoomChanged:', this.state.map.state.map.getZoom())
  }
//////////////////////////////////////////////////////////////
  _handleFavorite(evt) {
    evt.preventDefault()
    console.log("Favorited item", evt.target.id)

    // return axios({
    //   url: '/api/segments',
    //   method: 'post',
    //   data: {
    //     id: ,
    //     name: ,
    //     distance:
    //   }
    // })
    // .then(res => {
    //   console.log(res)
    // })
  }

  _getSegment(evt) {
    evt.preventDefault()
    console.log("Get segment info from strava for:", evt.target.id)

    return axios({
      url:`/api/strava/segments/${evt.target.id}`,
      method: 'get'
    })
    .then(res => {
      console.log(res.data.data)

      const currentSegment = res.data.data
      const currentSegmentElement = (
        <ul>
          <li><h4><strong>Selected Segment</strong></h4></li>
          <li><strong>Name:</strong> {currentSegment.name}</li>
          <li><strong>Activity Type:</strong> {currentSegment.activity_type}</li>
          <li><strong>Distance:</strong> {(currentSegment.distance / 1609.344).toFixed(2)} miles</li>
          <li><strong>Average Grade:</strong> {currentSegment.average_grade}%</li>
          <button id={currentSegment.id} name={currentSegment.name} style={{height: '30px', backgroundColor: 'green'}} onClick={this._handleFavorite.bind(this)}>Bookmark Segment</button>
          <hr />
        </ul>
      )

      this.setState({
        currentSegmentElement: currentSegmentElement
      })
    })
  }
//////////////////////////////////////////////////////////////
  render() {
    const location = {
      lat: 37.832429,
      lng: -122.479534
    }

    const segmentElements = this.state.segments.map((segment, i) => {
      return (
        <li key={i} id={segment.id}>
          <span id={segment.id} onClick={this._getSegment.bind(this)} >{segment.name}</span>
        </li>
      )
    })

    return (
      <div>
        <div>
          <Sidebar
            segments={segmentElements}
            currentSegment={this.state.currentSegmentElement}
          />
              <div className="main-container">

                <div>
                  <button name='signup' onClick={this._setView.bind(this)}>Sign Up</button>
                  <button name='login' onClick={this._setView.bind(this)}>Log In</button>
                  <button onClick={this._logOut.bind(this)}>Log Out</button>
                </div>

                  {{
                    home:
                      <section className="imagebg image--light cover cover-blocks bg--secondary" style={{padding: 0}}>
                        <div className="container">
                          <div className="row">
                            <div className="col-sm-6 col-md-5 col-md-offset-1">
                              <div>
                                <h1>Welcome to the Home Page!</h1>
                                <p className="lead">
                                  Navigate the map below to find running and/or cycling segments.
                                </p>
                                <hr className="short" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </section>,
                    login: <LogIn onLogin={this._logIn.bind(this)} />,
                    signup: <SignUp onSignup={this._signUp.bind(this)} />
                  }[this.state.view]}

                  <section id="elements" style={{padding: 0}}>
                    <div className="container" style={{padding: 0, height: `500px`}}>
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
                  </section>

                    {/* <Footer /> */}
                </div>
          </div>
        </div>
    )
  }
}
//////////////////////////////////////////////////////////////
export default App
