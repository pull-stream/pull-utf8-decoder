
var Decode = require('string_decoder').StringDecoder

module.exports = function () {
  var decoder = new Decode('utf-8'), ended
  return function (read) {
    return function (abort, cb) {
      if(ended) return cb(ended)
      read(abort, function (end, data) {
        if(ended = end) {
          var _data = decoder.end()
          cb(null, _data)
        } else {
          var _data = decoder.write(data)
          cb(null, _data)
        }
      })
    }
  }
}

