const
  express = require('express'),
  stravaRouter = new express.Router(),
  strava = require('strava-v3')
  stravaAccessToken = process.env.STRAVA_ACCESS_TOKEN

stravaRouter.post('/segments', (req, res) => {
  console.log('req data sent for map bounds:', req.body.boundary)
  strava.segments.explore({'access_token':'23c2e332af8d3fe34dadf3215ca46ab2c57c5752', 'bounds': req.body.boundary, 'activity_type': req.body.activityType}, (err, payload, limits) => {
    if (err) return console.log(err)
    console.log('data', payload)
    console.log('limits', limits)

    res.json({data: payload })
  })
})

stravaRouter.get('/segments/:id', (req, res) => {
  console.log('req received for segment id:', req.params.id)
  strava.segments.get({'access_token':'23c2e332af8d3fe34dadf3215ca46ab2c57c5752', 'id': req.params.id}, (err, payload, limits) => {
    if (err) return console.log(err)
    console.log('segment data:', payload)

    res.json({data: payload})
  })
})

module.exports = stravaRouter
