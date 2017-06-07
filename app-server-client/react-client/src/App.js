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
      bookmarks: [],
      currentSegmentElement: null,
      currentSegment: null,
      map: null,
      mapCenter: {
        lat: 37.832429,
        lng: -122.479534
      },
      bounds: null,
      currentUser: null,
      loggedIn: false,
      view: 'home'
    }
  }

  componentDidMount() {
    const currentUser = clientAuth.getCurrentUser()
    clientAuth.getBookmarks().then(res => {
      this.setState({
        currentUser: currentUser,
        loggedIn: !!currentUser,
        bookmarks: res.data
      })
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

    this._loadNewMapSegments(boundaryStr)
  }

  _zoomChanged() {
    console.log('_zoomChanged:', this.state.map.state.map.getZoom())

    const bounds = this.state.map.state.map.getBounds()
    const boundaryStr = `${bounds.f.b}, ${bounds.b.b}, ${bounds.f.f}, ${bounds.b.f}`

    this._loadNewMapSegments(boundaryStr)  
  }

  _loadNewMapSegments(bounds) {
    console.log('retrieving new strava segments')
    return axios({
      url: '/api/strava/segments',
      method: 'post',
      data: {boundary: bounds}
    })
    .then(res => {
      console.log(res.data.data.segments)
      this.setState({
        segments: [
          ...res.data.data.segments
        ],
        bounds: bounds
      })
    })
  }
//////////////////////////////////////////////////////////////
  _addBookmark(evt) {
    evt.preventDefault()
    console.log("Bookmarked item", evt.target.id)

    const newBookmark = {
      stravaId: this.state.currentSegment.id,
      name: this.state.currentSegment.name,
      activityType: this.state.currentSegment.activity_type,
      distance: this.state.currentSegment.distance,
      polyline: this.state.currentSegment.map.polyline
    }

    clientAuth.addBookmark(newBookmark).then(res => {
      this.setState({
        bookmarks: [
          ...this.state.bookmarks,
          res.data.segment
        ]
      })
    })
  }

  _deleteBookmark(evt) {
    evt.preventDefault()
    const id = evt.target.id

    clientAuth.deleteBookmark(id).then(res => {
      this.setState({
        bookmarks: this.state.bookmarks.filter((segment) => {
          return segment._id !== id
        })
      })
    })
  }
  //////////////////////////////////////////////////////////////
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
          <button id={currentSegment.id} name={currentSegment.name} style={{height: '30px', backgroundColor: 'green'}} onClick={this._addBookmark.bind(this)}>Bookmark Segment</button>
          <hr />
        </ul>
      )

      this.setState({
        currentSegmentElement: currentSegmentElement,
        currentSegment: currentSegment,
        mapCenter: {
          lat: currentSegment.start_latitude,
          lng: currentSegment.start_longitude
        },
        segments: [
          currentSegment
        ]
      })
    })
  }
//////////////////////////////////////////////////////////////
  render() {
    const bookmarkElements = this.state.bookmarks.map((segment, i) => {
      return (
        <li key={i} id={segment.stravaId}>
          <span id={segment.stravaId} onClick={this._getSegment.bind(this)} >{segment.name}</span>
          <span id={segment._id} style={{float:'right'}} className="glyphicon glyphicon-trash" aria-hidden="true" onClick={this._deleteBookmark.bind(this)}></span>
        </li>
      )
    })

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
            bookmarks={bookmarkElements}
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
                        center={this.state.mapCenter}
                        segments={this.state.segments}
                        currentSegment={this.state.currentSegment}
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
