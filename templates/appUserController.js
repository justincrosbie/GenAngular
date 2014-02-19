
/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , User = mongoose.model('User')
  ${--repeat3:model:model[@represents-user="true"]:
	, ${model.camelname} = mongoose.model('${model.camelname}')
  --3}

//exports.signin = function (req, res) {}

/**
 * Auth callback
 */

exports.authCallback = function (req, res, next) {
  res.redirect('/')
}

/**
 * Show login form
 */

exports.signin = function (req, res) {
  res.render('users/signin', {
    title: 'Signin',
    message: req.flash('error')
  })
}

/**
 * Show sign up form
 */

${--repeat1:model:model[@represents-user="true"]:
exports.prodetailssignup = function (req, res) {
  res.render('users/${model.name}signup', {
    title: '|${model.title} Sign up',
    user: new User()
  })
}
--1}

/**
 * Logout
 */

exports.signout = function (req, res) {
  req.logout()
  res.redirect('/')
}

/**
 * Session
 */

exports.session = function (req, res) {
  res.redirect('/')
}

/**
 * Create user
 */

exports.create = function (req, res) {
  var user = new User(req.body)
  user.provider = 'local'

  console.log("Account Type = " + req.body.accountType);

${--repeat2:model:model[@represents-user="true"]:
  if ( req.body.accountType == 1 ) {
    var ${model.name} = new ${model.camelname}(req.body);
    ${model.name}.save(function (err2) {
      if (err2) {
        return res.render('users/${model.name}signup', { errors: err.errors, user: user })
      }
      user.${model.name} = ${model.name};

      user.save(function (err) {
        if (err) {
          return res.render('users/${model.name}signup', { errors: err.errors, user: user })
        }

        req.logIn(user, function(err) {
          if (err) return next(err)
          return res.redirect('/')
        })
      })
    });

  }
--2}
}

/**
 *  Show profile
 */

exports.show = function (req, res) {
  var user = req.profile
  res.render('users/show', {
    title: user.name,
    user: user
  })
}

exports.me = function (req, res) {
  res.jsonp(req.user || null);
}

/**
 * Find user by id
 */

exports.user = function (req, res, next, id) {
  User
    .findOne({ _id : id })
    .exec(function (err, user) {
      if (err) return next(err)
      if (!user) return next(new Error('Failed to load User ' + id))
      req.profile = user
      next()
    })
}
