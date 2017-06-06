const
  mongoose = require('mongoose'),
  segmentSchema = new mongoose.Schema({
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    stravaId: {type: Number},
    name: {type: String},
    activityType: {type: String, default: 'Cycling'},
    distance: {type: Number}
  })

const Segment = mongoose.model('Segment', segmentSchema)
module.exports = Segment
