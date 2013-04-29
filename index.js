exports = module.exports = render

var photoshop = require('photoshop')
var Readable = require('readable-stream').Readable
var url = require('url')
var fs = require('fs')
var request = require('request')

function render(config){
  var stream = new Readable({objectMode:true})
  
  function _error(error){
    stream.emit('error', error);
    stream.push(null)
  }
  
  stream._read = function(size){
    stream._read = function(){}
    if (!(config && config.uri)) return _error(Error('bad uri'));
    
    downloadImage(config.uri, function(error, _path){
      if (error) return _error(error);
      photoshop.invoke(jsx_placeSmartObject, [_path, config.uri, config.name || config.uri], function(error, layerRef){
        if (error) return _error(error);
        stream.push(layerRef.identifier.toString())
        stream.push(null)
      })
    })
  }
  
  return stream
}

var path = require('path')

function downloadImage(_url, callback){
  request.head(_url, function(error, response, body){
    if (error) return callback(error);
    
    var ext = response.headers['content-type'] && response.headers['content-type'].split('/')[1]
    if (!ext) ext = path.extname(response.req.pathname).replace('.','');
    if (!ext) ext = 'png';
    
    var _path = process.env.TMPDIR + '/TemporaryItems/' + encodeURIComponent(_url) + '.' + ext
    
    var stream = request(_url)
    stream.pipe(fs.createWriteStream(_path))
    stream.on('end', function(){ callback(null, _path) })
    stream.on('error', callback)
  })
}

function jsx_placeSmartObject(sourcePath, sourceURI, layerName){
  if (app.documents.length === 0) PSFakeDOM.makeDocument()
  PSFakeDOM.makeLayer()
  PSFakeDOM.newPlacedLayer()
  var layerRef = PSFakeDOM.layerRefForActiveLayer()
  PSFakeDOM.setLayer_source(layerRef, sourcePath)
  PSFakeDOM.setLayer_sourceMeta(layerRef, sourceURI)
  app.activeDocument.activeLayer.name = layerName
  return layerRef
}

if (!module.parent) require('./test');
