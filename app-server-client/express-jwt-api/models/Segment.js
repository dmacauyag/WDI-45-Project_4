const
  mongoose = require('mongoose'),
  segmentSchema = new mongoose.Schema({
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    stravaId: {type: Number},
    name: {type: String},
    activityType: {type: String, default: 'Ride'},
    distance: {type: Number},
    polyline: {type: String}
  })

const Segment = mongoose.model('Segment', segmentSchema)
module.exports = Segment
