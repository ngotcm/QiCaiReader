"use strict";
/*
 * The qicai thread server for dev.
 *
 * Usage: node bin/server.js
 */

require('../config/config.js');
try {
  require('../config.local.js');
} catch (ignore) {
  console.log('No ../example/config.local.js found.');
}

var connect = require('connect');

var path = require('path');
var url = require('url');
var fs = require('fs');

// global variables
//get static root from config settings. 
var archivePath = path.join(__dirname, '../', config.crawlOptions.working_root_path, config.crawlOptions.host);
var ROOT_PATH = path.join(__dirname, '../', config.crawlOptions.working_root_path);
console.log('Working path:', archivePath);
console.log('ROOT_PATH:',ROOT_PATH);

var timmer = null;
var cssFile = path.join(__dirname,'../template/css.css');
var distCss = path.join(archivePath,'forum/css.css');

fs.watch(path.dirname(cssFile), function(event, filename){
  console.log(filename,':', event, timmer !== null);

  if(event === 'change' && filename==='css.css'){
    if(timmer){
      clearTimeout(timmer);
      console.log(timmer);
      timmer = null;
    } 

    timmer = setTimeout(function(){
     console.log('Hello'); 
     fs.createReadStream(cssFile, {
       flags: 'r',
       encoding: null,
       fd: null,
       mode: '0666',
       autoClose: true
     }).pipe(fs.createWriteStream(distCss));
    },500);

  } 
});

var webServer = connect();

webServer .use(connect.logger(':method :url - :res[content-type]', { buffer: 5000 }))
webServer .use(function (req, res, next) {
  if (req.url === '/') {
    req.url = url.parse(config.crawlOptions.page).path;
  }
  next();
});

//Static files;
webServer.use(connect.static(archivePath));

//tail router.
webServer.use(function (req, res) {
  console.error('url 404:', req.url);
  res.statusCode = 404;
  res.setHeader('Content-Type', 'text/plain');
  res.end('URI : "' + req.url + '" NOT crawled from ' + config.crawlOptions.host);
});

//start server
webServer.listen(config.port);
console.log("Crawler site server started at port:", config.port);
console.log("Waiting for connection ...");

