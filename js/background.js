(function() {
  'use strict';
  
  chrome.runtime.onInstalled.addListener(function() {
    chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
      chrome.declarativeContent.onPageChanged.addRules([
        {
          conditions: [
            new chrome.declarativeContent.PageStateMatcher({
              pageUrl: {
                hostEquals: 'www.merlot.org',
                pathContains: '/merlot/viewMember.htm',
                queryContains: 'id'
              }
            })
          ],
          actions: [ new chrome.declarativeContent.ShowPageAction() ]
        }
      ]);
    });
  });
})();