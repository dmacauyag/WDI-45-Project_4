const
  User = require('../models/User.js'),
  serverAuth = require('../config/serverAuth.js')

module.exports = {
  index,
  show,
  create,
  update,
  destroy
}

function index(req, res) {
  User.find({}, '-__v', (err, users) => {
    if(err) return console.log(err)
    res.json(users)
  })
}

function show(req, res) {
  User.findById(req.params.id, (err, user) => {
    if(err) return console.log(err)
    res.json(user)
  })
}

function create(req, res) {
  User.create(req.body, (err, user) => {
    if(err) return console.log(err)
    const userData = user.toObject()
    delete userData.password
    const token = serverAuth.createToken(userData)

    res.json({success: true, message: "New user account created.", user, token})
  })
}

function update(req, res) {
  User.findById(req.params.id, (err, user) => {
    if(err) return console.log(err)
    Object.assign(user, req.body)
    user.save((err) => {
      if(err) return console.log(err)
      res.json({success: true, message: "User information updated.", user: user})
    })
  })
}

function destroy(req, res) {
  User.findByIdAndRemove(req.params.id, (err, user) => {
    if(err) return console.log(err)
    res.json({success: true, message: "User deleted."})
  })
}
