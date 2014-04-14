/**
 * FileName: app.js
 * Author: @Inaction
 * CreateTime: 2014-04-08 11:32
 * Description:
 *     www.ngotcm.com 《民间中医奇才》 crawler for reader.
 */

(function () {
  "use strict";

//Add config to global.config
  require('./config/config.js');
  try {
    require('./config.local.js');
  } catch (e) {
    console.log('No local config, using default');
  }

  var path = require('path');
  var url = require('url');
  var fs = require('fs');
  var qicai = require('crawlit/lib/plugins/qicai');
  var logger = require('crawlit/lib/logger').getLogger('info');


//Override configuration.
//config.crawlOptions.working_root_path = path.join(__dirname, '../run/qicai');

  var domCrawler = require('crawlit').domCrawler;

  domCrawler.init();
  domCrawler.crawl(config.crawlOptions.page);

  var ROOT_DIR = path.join(__dirname, config.crawlOptions.working_root_path, config.crawlOptions.host, 'forum');
  fs.readdir(
      ROOT_DIR,
      function (err, files) {
        if (err) throw err;

        var last, pageLast = 0, test = /^thread.*\.html$/, needUpdateLastPageQueue = [];

        //get last page to update
        files.forEach(function (file) {
          logger.debug('test file:', file, 'test result=',test.test(file)); 
          if (test.test(file)) {
            var page = parseInt(file.split('-')[2], 10);
            if (page > pageLast) {
              if (last) {
                needUpdateLastPageQueue.push(last + "");//closure fix
              }
              last = file;
              pageLast = page;
            } else {
              needUpdateLastPageQueue.push(file);
            }
          }
        });

        logger.info('last:',last, 'need update:', needUpdateLastPageQueue.length);

        
        domCrawler.update(last);
        for(var i=1; i<=6; i++){
          var lastSix = 'thread-50247-' + (pageLast - i) + '-1.html';
          logger.debug('add lastSix:',lastSix);
          domCrawler.update(lastSix); 
        }
        //fix it
        pageLast = 1561;

        qicai.watchPage(last, function (href, hrefText) {
          logger.info('Found last page', href, hrefText);

          var lastPageNumber = parseInt(href.split('-')[2], 10);
          logger.info('New page number:', lastPageNumber,'Old page number:', pageLast);

          if (lastPageNumber > pageLast) {
            logger.info('Replace old last page');
            var searchValue = '<a href="/forum/thread-50247-' + pageLast + '-1.html" class="last">... ' + pageLast + '</a>';
            var replaceValue = '<a href="/forum/thread-50247-' + lastPageNumber + '-1.html" class="last">' + hrefText + '</a>';
            pageLast = lastPageNumber;
            needUpdateLastPageQueue.forEach(function (file) {
              file = path.join(ROOT_DIR, file);
              logger.debug('replaceing:', file);
              var result = fs.readFileSync(file, {encoding: 'utf8'});
              fs.writeFileSync(file, result.replace(searchValue, replaceValue));
            });
          }
        });
      });
})();
