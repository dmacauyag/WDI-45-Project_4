import React, { Component } from 'react'
import { withGoogleMap, GoogleMap, Marker, Polyline } from 'react-google-maps'
import axios from 'axios'

axios.defaults.baseURL = 'http://localhost:3001'

// function to decode google maps api polyline taken from:
// https://gist.github.com/ismaels/6636986
// source: http://doublespringlabs.blogspot.com.br/2012/11/decoding-polylines-from-google-maps.html
function decodePolyline(encoded){

    // array that holds the points

    var points=[ ]
    var index = 0, len = encoded.length;
    var lat = 0, lng = 0;
    while (index < len) {
        var b, shift = 0, result = 0;
        do {

    b = encoded.charAt(index++).charCodeAt(0) - 63;//finds ascii                                                                                    //and substract it by 63
              result |= (b & 0x1f) << shift;
              shift += 5;
             } while (b >= 0x20);


       var dlat = ((result & 1) != 0 ? ~(result >> 1) : (result >> 1));
       lat += dlat;
      shift = 0;
      result = 0;
     do {
        b = encoded.charAt(index++).charCodeAt(0) - 63;
        result |= (b & 0x1f) << shift;
       shift += 5;
         } while (b >= 0x20);
     var dlng = ((result & 1) != 0 ? ~(result >> 1) : (result >> 1));
     lng += dlng;

   points.push({lat:( lat / 1E5),lng:( lng / 1E5)})

  }
  return points
    }

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

  _handleClickMarker(id) {
    this.props.onMarkerClick(id)
  }

  render() {
    const markers = this.props.segments.map((segment, i) => {
      const marker = {
        position: {
          lat: segment.start_latlng[0],
          lng: segment.start_latlng[1]
        },
        segmentId: segment.id
      }
      return <Marker
              key={i}
              onClick={this._handleClickMarker.bind(this, segment.id)}
              {...marker} />
    })

    const currentSegmentMarkerStart = this.props.currentSegment
      ? {
        lat: this.props.currentSegment.start_latitude,
        lng: this.props.currentSegment.start_longitude
      }
      : null

    const currentSegmentMarkerEnd = this.props.currentSegment
      ? {
        lat: this.props.currentSegment.end_latitude,
        lng: this.props.currentSegment.end_longitude
      }
      : null

    const decodedPolyline = this.props.polyline
      ? decodePolyline(this.props.polyline)
      : []

    return (
      <GoogleMap
        ref={this.props.ref}
        onDragEnd={this.props.onDragEnd}
        onZoomChanged={this.props.onZoomChanged}
        defaultZoom={this.props.zoom}
        center={this.props.center} >
        {markers}
        <Marker position={currentSegmentMarkerStart}/>
        <Marker position={currentSegmentMarkerEnd}/>
        <Polyline path={decodedPolyline} />
      </GoogleMap>
    )
  }
}

export default withGoogleMap(Map)
