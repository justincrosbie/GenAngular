
var async = require('async')

module.exports = function (app, passport, auth) {

  // user routes
  var users = require('../app/controllers/users')
  app.get('/signin', users.signin)
  app.get('/signup', users.signup)
  app.get('/signout', users.signout)
  app.post('/users', users.create)
  app.post('/users/session', passport.authenticate('local', {failureRedirect: '/signin', failureFlash: 'Invalid email or password.'}), users.session)
  app.get('/users/me', users.me)
  app.get('/users/:userId', users.show)
  
  app.param('userId', users.user)
  

  ${--repeat1:model:model:
  // ${model.name} routes
  var ${model.name}s = require('../app/controllers/${model.name}s')  
  app.get('/${model.name}s', ${model.name}s.query)
  app.get('/${model.name}s/count', ${model.name}s.queryCount)
  app.post('/${model.name}s', auth.requiresLogin, ${model.name}s.create)
  app.get('/${model.name}s/:${model.name}Id', ${model.name}s.show)
  app.put('/${model.name}s/:${model.name}Id', auth.requiresLogin, ${model.name}s.update)
  app.del('/${model.name}s/:${model.name}Id', auth.requiresLogin, ${model.name}s.destroy)
 
  app.param('${model.name}Id', ${model.name}s.${model.name})
  --1}

      // home route
  var index = require('../app/controllers/index')
  app.get('/', index.render)

}
