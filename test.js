var t = require('tap')
var placeIntoPS = require('./')

t.test("works like an old stream", function(t){
  
  var config = {
    uri: "http://graph.facebook.com/subtlegradient/picture",
    name: "SubtleGradient"
  }
  
  var stream = placeIntoPS(config)
  stream.on('data', function(data){
    t.ok(data > 0)
  })
  stream.on('end', function(){
    t.end()
  })
  
})

t.test('exists', function(t){
  t.ok(placeIntoPS)
  t.is(typeof placeIntoPS, 'function')
  t.end()
})

t.test('emits error with no config', function(t){
  var stream = placeIntoPS()
  stream.on('error', function(error){
    t.pass(error)
    t.end()
  })
  stream.read()
})

t.test('emits error with bad uri', function(t){
  var stream = placeIntoPS({ })
  stream.on('error', function(error){
    t.pass(error)
    t.end()
  })
  stream.read()
})
t.test('emits error with bad uri', function(t){
  var stream = placeIntoPS({ uri:"http://localhost:9999/this-should-not-work" })
  stream.on('error', function(error){
    t.pass(error)
    t.end()
  })
  stream.read()
})

t.test('place a url into a photoshop document', function(t) {
  var config = {
    uri: "http://graph.facebook.com/subtlegradient/picture"
  }
  var stream = placeIntoPS(config)
  
  stream.on('data', function(data){
    console.log(data)
  })
  
  stream.on('error', function(error){
    console.error(error)
    t.fail(error)
    t.end()
  })
  
  stream.on('end', function(){
    require('photoshop').invoke(function(){
      return PSFakeDOM.getParsedMetaDataForLayerId(app.activeDocument.activeLayer.id)
    }, function(error, parsedMetadata){
      t.is(parsedMetadata.source, config.uri, "uri must be added to the layer metadata")
      t.end()
    })
  })
  
})

t.test('implements streams2', function(t){
  
  var config = {
    uri: "http://graph.facebook.com/subtlegradient/picture",
    name: "SubtleGradient"
  }
  
  var stream = placeIntoPS(config)
  t.end()
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
      t.is(layerName, config.name, "layerName must be applied to layer")
      t.end()
    })
  })
  
  stream.resume()
})
