import React, { Component } from 'react'
import { withGoogleMap, GoogleMap, Marker } from 'react-google-maps'

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
  }

  _zoomChanged() {
    console.log('_zoomChanged:', this.state.map.getZoom())
  }

  render() {
    const markers = this.props.markers || []

    return (
      <GoogleMap
        ref={this._mapLoaded.bind(this)}
        onDragEnd={this._mapMoved.bind(this)}
        onZoomChanged={this._zoomChanged.bind(this)}
        defaultZoom={this.props.zoom}
        defaultCenter={this.props.center} >
        {markers.map((marker, index) => (
            <Marker {...marker} />
          )
        )}
      </GoogleMap>
    )
  }
}

export default withGoogleMap(Map)
