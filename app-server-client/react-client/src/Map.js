import React, { Component } from 'react'
import { withGoogleMap, GoogleMap, Marker } from 'react-google-maps'

class Map extends Component {
  render() {
    const markers = this.props.markers || []

    return (
      <GoogleMap
        defaultZoom={12}
        defaultCenter={{ lat: 34.0162932, lng: -118.3908012 }} >
        {markers.map((marker, index) => (
            <Marker {...marker} />
          )
        )}
      </GoogleMap>
    )
  }
}

export default withGoogleMap(Map)
