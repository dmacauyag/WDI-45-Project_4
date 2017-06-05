const
  express = require('express'),
  app = express(),
  logger = require('morgan'),
  bodyParser = require('body-parser'),
  mongoose = require('mongoose'),
  usersRoutes = require('./routes/users.js'),
  cors = require('cors'),
  mongoUrl = process.env.MONGO_URL || 'mongodb://localhost/letsmove',
  strava = require('strava-v3'),
  port = process.env.PORT || 3001

// connect to mongodb:
mongoose.connect(mongoUrl, (err) => {
  console.log(err || 'Connected to MongoDB.')
})

// log all incoming requests to the console:
app.use(logger('dev'))

// allow incoming ajax requests from other domains (including other localhost ports)
app.use(cors())

// interpret bodies of data that are included in requests:
app.use(bodyParser.json()) // interpret json bodies
app.use(bodyParser.urlencoded({extended: false})) // interpret form data

// server root route:
app.get('/', (req, res) => {
  res.json({message: "Server root. All API routes start with /api..."})
})

// testing strava API calls
// strava.segments.get({'access_token':'23c2e332af8d3fe34dadf3215ca46ab2c57c5752', 'id': '229781'}, (err,payload,limits) => {
//   if (err) return console.log(err)
//   console.log('data', payload)
//   console.log('limits', limits)
// })

strava.segments.explore({'access_token':'23c2e332af8d3fe34dadf3215ca46ab2c57c5752', 'bounds': '37.821362,-122.505373,37.842038,-122.465977'}, (err,payload,limits) => {
  if (err) return console.log(err)
  console.log('data', payload)
  console.log('limits', limits)
})


// apply all user routes here:
app.use('/api/users', usersRoutes)

// listen for incoming http requests:
app.listen(port, (err) => {
  console.log(err || `Server running on ${port}`)
})
