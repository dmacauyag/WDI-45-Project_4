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

module.exports = segmentsRouter
