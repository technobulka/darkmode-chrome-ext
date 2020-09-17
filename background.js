'use strict';

function getSavedMode(url, callback) {
  chrome.storage.sync.get(url, (items) => {
    callback(chrome.runtime.lastError ? null : items[url]);
  });
}

chrome.runtime.onInstalled.addListener(() =>
  chrome.tabs.query({}, tabs => tabs.forEach(({ url, id }) => {
    var url = new URL(url);

    getSavedMode(url.hostname, (savedMode) => {
      if (savedMode) {
        chrome.tabs.insertCSS(id, { file: 'invert.css', runAt: 'document_start' });
      }
    });
	}))
);

chrome.tabs.onUpdated.addListener((id, changeInfo) => {
  if (changeInfo.status == 'loading') {
    chrome.tabs.query({active: true}, tabs => {
      var tab = tabs[0];
      var url = new URL(tab.url);
  
      getSavedMode(url.hostname, (savedMode) => {
        if (savedMode) {
          chrome.tabs.insertCSS(id, { file: 'invert.css', runAt: 'document_start' });
        }
      });
    })
  }
});