var URL = require('url')
var path = require('path')

var _ = require('lodash')
var request = require('request')
var format = require('string-format')
var urljoin = require('url-join')
var gunzip = require('gunzip-maybe')
var tar = require('tar')

var canProcess = function (name) {
  var url = URL.parse(name)
  return _.endsWith(url.hostname, 'github.com')
}

var fetchSource = function (source, dir, next) {
  var tarUrl = urljoin(source, '/archive/master.tar.gz')
  var tarStream = request(tarUrl)
    .pipe(gunzip())
    .pipe(tar.Extract({ path: dir, strip: 1 }))
  .on('error', function (err) {
     return next(err)
  })
  .on('end', function () {
    next(null, dir)
  })
}

var generateName = function (source) {
  var url = URL.parse(source)
  var processedPath = _.startsWith(url.pathname, '/') ? url.pathname.slice(1) : url.pathname
  return processedPath.replace('/', '-')
}

module.exports = {
  canProcess: canProcess,
  fetchSource: fetchSource,
  generateName: generateName
}
