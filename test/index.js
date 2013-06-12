var pull = require('pull-stream')
var fs = require('fs')
var file = fs.readFileSync(__filename, 'utf-8').split(/(\n)/).map(function (e) { return new Buffer(e) })
var decode = require('../')

console.log(file)

var test = require('tape')

test('lines', function (t) {

  pull(
    pull.values(file),
    decode(),
  //  pull.map(JSON.stringify),
    pull.collect(function (err, ary) {
      console.log(ary.join(''))
      t.equal(file.map(String).join(''), ary.join(''))
      t.end()
    })
  )
})

test('utf-8', function (t) {
  var expected = 'cents:¢\neuros:€'

  var coinage = [
    new Buffer('cents:').toJSON(),
    [0xC2, 0xA2],
    new Buffer('\n').toJSON(),
    new Buffer('euros:').toJSON(),
    [0xE2, 0x82, 0xAC]
  ].reduce(function (a, b) {
    return a.concat(b)
  })

  function rSplit() {
    var s = coinage.slice()
    var a = []
    while(s.length) {
      var n = ~~(Math.random()*s.length) + 1
      a.push(s.splice(0, n))
    }
    return a.map(function (e) { return new Buffer(e) })
  }

  console.log(rSplit())
  pull(
    pull.count(100),
    pull.asyncMap(function (e, cb) {

      pull(
        pull.values(rSplit()),
        decode(),
        pull.collect(function (err, ary) {
          t.equal(ary.join(''), expected)
          cb()
        })
      )

    }),
    pull.drain(null, function () {
      t.end()
    })
  )
})


