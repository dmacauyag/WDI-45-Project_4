const
  express = require('express'),
  segmentsRouter = new express.Router(),
  Segment = require('../models/Segment.js'),
  authorize = require('../config/serverAuth.js').authorize

// middleware to check if there is a valid token prior to proceeding to any of the segments routes
segmentsRouter.use(authorize)

segmentsRouter.route('/')
  .get((req, res) => {
    Segment.find({user: req.decoded._id}, (err, segments) => {
      if(err) return console.log(err)
      res.json(segments)
    })
  })
  .post((req, res) => {
    const newSegment = new Segment(req.body)
    newSegment.user = req.decoded._id
    newSegment.save((err, segment) => {
      if(err) return console.log(err)
      res.json({success: true, message: "New segment created.", segment})
    })
  })

segmentsRouter.route('/:id')
  .patch((req, res) => {
    Segment.findById(req.params.id, (err, segment) => {
      if(err) return console.log(err)
      segment.timesCompleted += req.body.incrementor
      segment.save((err, segment) => {
        if(err) return console.log(err)
        res.json({success: true, message: "Segment updated.", segment})
      })
    })
  })
  .delete((req, res) => {
    Segment.findByIdAndRemove(req.params.id, (err, segment) => {
      if(err) return console.log(err)
      res.json({success: true, message: "Segment deleted.", segment})
    })
  })

module.exports = segmentsRouter
