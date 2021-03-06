const
  mongoose = require('mongoose'),
  segmentSchema = new mongoose.Schema({
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    stravaId: {type: Number, unique: true},
    name: {type: String},
    activityType: {type: String},
    distance: {type: Number},
    city: {type: String},
    state: {type: String},
    timesCompleted: {type: Number, default: 0, min: 0},
    polyline: {type: String}
  })

const Segment = mongoose.model('Segment', segmentSchema)
module.exports = Segment
