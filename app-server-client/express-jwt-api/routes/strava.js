const
  express = require('express'),
  stravaRouter = new express.Router(),
  strava = require('strava-v3')

stravaRouter.get('/segments', (req, res) => {
  strava.segments.explore({'access_token':'23c2e332af8d3fe34dadf3215ca46ab2c57c5752', 'bounds': '37.821362,-122.505373,37.842038,-122.465977'}, (err,payload,limits) => {
    if (err) return console.log(err)
    console.log('data', payload)
    console.log('limits', limits)

    res.json({data: payload })
  })
})

module.exports = stravaRouter
