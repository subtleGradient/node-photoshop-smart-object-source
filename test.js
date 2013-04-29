var t = require('tap')
var placeIntoPS = require('./')

t.test('exists', function(t){
  t.ok(placeIntoPS)
  t.is(typeof placeIntoPS, 'function')
  t.end()
})

t.test('throws unless config.uri', function(t){
  t.throws(function(){
    placeIntoPS()
  })
  t.throws(function(){
    placeIntoPS({})
  })
  t.throws(function(){
    placeIntoPS({url:""})
  })
  t.end()
})

t.test('emits error with bad uri', function(t){
  placeIntoPS({ uri:"http://localhost:9999/this-should-not-work" })
  .on('error', function(error){
    t.pass(error)
    t.end()
  })
})

t.test('place a url into a photoshop document', function(t) {
  var config = {
    uri: "http://graph.facebook.com/subtlegradient/picture"
  }
  var stream = placeIntoPS(config)
  stream.on('error', function(error){
    console.error(error)
    t.fail(error)
    t.end()
  })
  stream.on('end', function(){
    require('photoshop').invoke(function(){
      return PSFakeDOM.getParsedMetaDataForLayerId(app.activeDocument.activeLayer.id)
    }, function(error, parsedMetadata){
      t.is(parsedMetadata.source, config.uri)
      t.end()
    })
  })
})

t.test('place a url into a photoshop document with a name', function(t) {
  var config = {
    uri: "http://graph.facebook.com/subtlegradient/picture",
    name: "SubtleGradient"
  }
  var stream = placeIntoPS(config)
  stream.on('error', function(error){
    console.error(error)
    t.fail(error)
    t.end()
  })
  stream.on('end', function(){
    require('photoshop').invoke(function(){
      return app.activeDocument.activeLayer.name
    }, function(error, layerName){
      t.is(layerName, config.name)
      t.end()
    })
  })
})

