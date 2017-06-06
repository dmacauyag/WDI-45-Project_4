import React, { Component } from 'react'
import { withGoogleMap, GoogleMap, Marker } from 'react-google-maps'
import axios from 'axios'

axios.defaults.baseURL = 'http://localhost:3001'

class Map extends Component {
  // constructor() {
  //   super()
  //   this.state = {
  //     map: null,
  //     segments: [],
  //     bounds: null
  //   }
  // }

  // _mapLoaded(map) {
  //   console.log('_mapLoaded')
  //   if (this.state.map != null)
  //     return
  //   this.setState({
  //     map: map
  //   })
  // }
  //
  // _mapMoved() {
  //   console.log('_mapMoved center:', JSON.stringify(this.state.map.getCenter()))
  //
  //   const bounds = this.state.map.getBounds()
  //   const boundaryStr = `${bounds.f.b}, ${bounds.b.b}, ${bounds.f.f}, ${bounds.b.f}`
  //
  //   return axios({
  //     url: '/api/strava/segments',
  //     method: 'post',
  //     data: {boundary: boundaryStr}
  //   })
  //   .then(res => {
  //     console.log(res.data.data.segments)
  //     this.setState({
  //       segments: [
  //         ...res.data.data.segments
  //       ],
  //       bounds: boundaryStr
  //     })
  //   })
  // }
  //
  // _zoomChanged() {
  //   console.log('_zoomChanged:', this.state.map.getZoom())
  // }

  render() {
    const markers = this.props.segments.map((segment, i) => {
      const marker = {
        position: {
          lat: segment.start_latlng[0],
          lng: segment.start_latlng[1]
        }
      }
      return <Marker key={i} {...marker} />
    })

    return (
      <GoogleMap
        ref={this.props.ref}
        onDragEnd={this.props.onDragEnd}
        onZoomChanged={this.props.onZoomChanged}
        defaultZoom={this.props.zoom}
        defaultCenter={this.props.center} >
        {markers}
      </GoogleMap>
    )
  }
}

export default withGoogleMap(Map)
