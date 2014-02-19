
var path = require('path')
  , rootPath = path.normalize(__dirname + '/..')
  , templatePath = path.normalize(__dirname + '/../app/mailer/templates')
  , notifier = {
      APN: false,
      email: false, // true
      actions: ['comment'],
      tplPath: templatePath,
      postmarkKey: 'POSTMARK_KEY',
      parseAppId: 'PARSE_APP_ID',
      parseApiKey: 'PARSE_MASTER_KEY'
    }

module.exports = {
  development: {
    db: 'mongodb://localhost/${app.db}-dev',
    root: rootPath,
    notifier: notifier,
    app: {
      name: '${app.title} - Development'
    }
  },
  test: {
    db: 'mongodb://localhost/${app.db}-test',
    root: rootPath,
    notifier: notifier,
    app: {
      name: '${app.title} - Test'
    }
  },
  production: {
    db: 'mongodb://${app.db-url}',
    root: rootPath,
    notifier: notifier,
    app: {
      name: '${app.title} - Production'
    }
  }
}
