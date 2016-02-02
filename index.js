
var Decode = require('string_decoder').StringDecoder

module.exports = function (enc) {
  var decoder = new Decode(enc || 'utf-8'), ended
  return function (read) {
    return function (abort, cb) {
      if(ended) return cb(ended)
      read(abort, function (end, data) {
        if(ended = end && end !== true)
          cb(end)
        else if(end)
          cb(null, decoder.end())
        else
          cb(null, decoder.write(data))
      })
    }
  }
}



