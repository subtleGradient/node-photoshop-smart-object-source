# photoshop-smart-object-source

Inject stuff into Photoshop.

---

Install

    npm install photoshop-smart-object-source

Use

    var placeIntoPS = require('photoshop-smart-object-source')
    
    var stream = placeIntoPS({
      uri: "http://graph.facebook.com/subtlegradient/picture",
      name: "SubtleGradient"
    })
    
    stream.on('end', function(){
      console.log('Success!')
    })

