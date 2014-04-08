/**
 * FileName: config.js
 * Author: @mxfli
 * CreateTime: 2014-04-08 14:39
 * Description:
 *      Config of this nocancer app.
 */

var config = {
  appName: 'QiCaiCrawler',
  version: '0.1.0',
  port: '1231', 
  appDomain: 'localhost',
  maxMemoryUsage: 500
};

config.crawlOptions = {
  maxConnections: 1,
  maxRetryCount: 3, 
  requestTimeout: 30 * 1000,
  savePoint: 50, //save data every 50 rui finished.
  recursive: true,
  working_root_path: 'run/qicai2',
  inputEncoding : 'gbk',
  page : 'http://www.ngotcm.com/forum/thread-50247-1-1.html',
  Host : 'www.ngotcm.com',
  resourceParser: require('crawlit/lib/plugins/qicai')
};

//Default client http request options
config.requestOptions = {
  domain: 'www.ngotcm.com',
  port: 80,
  Cookie: 'bdshare_firstime=1393155630905; Hm_lvt_23234f06c4cd9a705eb19ee58a9d4470=1396252553;',
  //Default user angent is google chrome 16
  "User-Agent": 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/535.7 (KHTML, like Gecko) Chrome/16.0.912.63 Safari/535.7'
};

//add config to global
global.config = config;
console.log('App config options init: global["config"]');
//console.log('App config options:\n', config);
