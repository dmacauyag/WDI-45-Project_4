import React, { Component } from 'react'
import { withGoogleMap, GoogleMap, Marker } from 'react-google-maps'
import axios from 'axios'

axios.defaults.baseURL = 'http://localhost:3001'

class Map extends Component {
  constructor() {
    super()
    this.state = {
      map: null
    }
  }

  _mapLoaded(map) {
    if (this.state.map != null)
      return
    this.setState({
      map: map
    })
  }

  _mapMoved() {
    console.log('_mapMoved:', JSON.stringify(this.state.map.getCenter()))

    return axios({
      url: '/api/strava/segments',
      method: 'get'
    })
    .then(res => {
      console.log(res.data.data.segments)
    })
  }

  _zoomChanged() {
    console.log('_zoomChanged:', this.state.map.getZoom())
  }

  render() {
    const markers = this.props.markers.map((segment, i) => {
      const marker = {
        position: {
          lat: segment.location.lat,
          lng: segment.location.lng
        }
      }
      return <Marker key={i} {...marker} />
    })

    return (
      <GoogleMap
        ref={this._mapLoaded.bind(this)}
        onDragEnd={this._mapMoved.bind(this)}
        onZoomChanged={this._zoomChanged.bind(this)}
        defaultZoom={this.props.zoom}
        defaultCenter={this.props.center} >
        {markers}
      </GoogleMap>
    )
  }
}

export default withGoogleMap(Map)
