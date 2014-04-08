/**
 * FileName: ngotcm.js
 * Author: @mxfli
 * CreateTime: 2014-04-08 11:32
 * Description:
 *     www.ngotcm.com 奇才贴 crawler.
 */

//Add config to global.config
require('./config/config.js');
try{
  require('./config.local.js');
}catch(e){
  console.log('No local config, using default');
}

var path = require('path');

//Override configuration.
//config.crawlOptions.working_root_path = path.join(__dirname, '../run/qicai');

var domCrawler = require('crawlit').domCrawler;

domCrawler.init();
domCrawler.crawl(config.crawlOptions.page);
