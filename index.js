exports = module.exports = render

var photoshop = require('photoshop')
var streamify = require('streamify')
var url = require('url')
var fs = require('fs')
var request = require('request')

function render(config){
  if (!config.uri) throw Error('file not found');
  
  var placeholder = streamify()
  
  downloadImage(config.uri, function(error, _path){
    if (error) return placeholder.emit('error', error);
    photoshop.invoke(jsx_placeSmartObject, [_path, config.uri, config.name || config.uri], function(error, result){
      if (error) return placeholder.emit('error', error);
      placeholder.emit('data', 'true')
      placeholder.emit('end')
    })
  })
  
  return placeholder
}

var path = require('path')

function downloadImage(_url, callback){
  console.log('downloadImage', _url)
  request.head(_url, function(error, response, body){
    if (error) return callback(error);
    
    var ext = response.headers['content-type'] && response.headers['content-type'].split('/')[1]
    if (!ext) ext = path.extname(response.req.pathname).replace('.','');
    if (!ext) ext = 'png';
    
    var _path = process.env.TMPDIR + '/TemporaryItems/' + encodeURIComponent(_url) + '.' + ext
    console.log('_path', _path)
    
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
}

if (!module.parent) require('./test');
