const
  express = require('express'),
  stravaRouter = new express.Router(),
  strava = require('strava-v3')

stravaRouter.post('/segments', (req, res) => {
  console.log('request received')
  console.log('req data sent:', req.body.boundary)
  strava.segments.explore({'access_token':'23c2e332af8d3fe34dadf3215ca46ab2c57c5752', 'bounds': req.body.boundary}, (err,payload,limits) => {
    if (err) return console.log(err)
    console.log('data', payload)
    console.log('limits', limits)

    res.json({data: payload })
  })
})

module.exports = stravaRouter
