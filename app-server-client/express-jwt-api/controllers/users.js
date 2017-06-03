const
  User = require('../models/User.js')

module.exports = {
  index,
  show,
  create,
  update,
  destroy
}

function index(req, res) {
  User.find({}, '-__v', (err, users) => {
    res.json(users)
  })
}

function show(req, res) {
  User.findById(req.params.id, (err, user) => {
    res.json(user)
  })
}

function create(req, res) {
  User.create(req.body, (err, user) => {
    res.json({success: true, message: "User account created.", user})
  })
}

function update(req, res) {
  User.findById(req.params.id, (err, user) => {
    if(err) return console.log(err)
    Object.assign(user, req.body)
    user.save((err) => {
      res.json({success: true, message: "User updated...", user: user})
    })
  })
}

function destroy(req, res) {
  User.findByIdAndRemove(req.params.id, (err, user) => {
    if(err) return console.log(err)
    res.json({success: true, message: "User deleted..."})
  })
}
