var fs = require('fs')
var uuid = require('uuid')

module.exports = function (giffer, opts) {
  if (!opts.saveDir) throw new Error('yo, where should i put that stuff?!')

  var previousId = null
  var currentId = uuid.v1()
  var nextId = uuid.v1()
  var pageSize = opts.pageSize || 30

  var images = []

  giffer.on('gif', function (filename, metadata) {
    images.push({ filename: filename, metadata: metadata })
    if (images.length >= pageSize) {
      dumpPage(images, currentId, previousId, nextId, opts.saveDir)
      previousId = currentId
      currentId = nextId
      nextId = uuid.v1()
      images = []
    }
  })
}

function dumpPage (images, currentId, previousId, nextId, saveDir) {
  var obj = {
    images: images,
    previous: previousId,
    next: nextId
  }

  fs.writeFile(saveDir + '/' + currentId + '.json', JSON.stringify(obj), 'utf8', function (err) {
    if (err) throw err
    fs.symlink(saveDir + '/' + currentId + '.json', saveDir + '/current.json', function () {})
  })
}
