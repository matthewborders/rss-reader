'use strict';

var Promise = require("bluebird");
var parseURL = Promise.promisify(require('rss-parser').parseURL);

function parseFeed(url, result) {
  return parseURL(url).then(function(parsed) {
    let feed = {
      title: parsed.feed.title,
      articles: []
    };

    for (let i=0; i<parsed.feed.entries.length; i++) {
      let entry = parsed.feed.entries[i];

      feed.articles.push({
        title: entry.title,
        date: entry.pubDate,
        url: entry.link
      });

      if (feed.articles.length == 10) break;
    }

    result.feeds.push(feed);
  });
}

function parseFeeds(urls, result) {
  if (urls.length === 0) return;

  return parseFeed(urls.shift(), result).then(function() {
    return parseFeeds(urls, result);
  });
}

let result = {
  feeds: []
};

parseFeeds(process.argv[2].split(','), result).then(function() {
  result.feeds.forEach(function(feed) {
    console.log('Feed: '+feed.title);

    feed.articles.forEach(function(article) {
      console.log('Article: '+article.title);
      console.log('Date: '+article.date);
      console.log('URL: '+article.url);
      console.log('');
    });

    console.log('-------------------------------');
  });
});