var test = require('tape')
var levelup = require('levelup')
var Giffer = require('giffer')

test('basic functionality', function (t) {
  var db = levelup('/whatever', {
    db: require('memdown'),
    valueEncoding: 'json'
  })

  var giffer = new Giffer({
    db: db,
    outputDir: __dirname + '/images',
    adapters: [new (require('./testadapter'))()]
  })

  giffer.plugin(require('../'), {
    saveDir: __dirname + '/static-files',
    pageSize: 1
  })

  giffer.start()

  t.end()
})
