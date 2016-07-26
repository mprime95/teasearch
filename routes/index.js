
/*
 * GET home page.
 */

exports.index = function(req, res){
  var path = require('path');
  res.sendfile(path.resolve('public/templates/index.html'));
};
