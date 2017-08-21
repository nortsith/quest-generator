var express = require('express'),
    request = require('request'),
    path    = require('path'),
    fs      = require('fs'),
    router  = express.Router();

router.post('/parse-body', function (req, res) {
  request(req.query.adress, function (error, response, body) {
    res.send(body);
  });
});

router.post('/data', function (req, res) {
  if(req.query.type == "read"){
    res.sendFile(path.resolve('./client/database/data.json'));
  } else{
    res.send(req.query.data);

    function appendObject(obj){
      var configFile = fs.readFileSync('./client/database/data.json');
      var config = JSON.parse(configFile);
      config.push(obj);
      var configJSON = JSON.stringify(config);
      fs.writeFileSync('./client/database/data.json', configJSON);
    }

    appendObject(req.query.data);
  }
});

module.exports = router;
