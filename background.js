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

let injected = false;

chrome.tabs.onUpdated.addListener((id, changeInfo, tab) => {
  if (changeInfo.status == 'loading') {
    let url = new URL(tab.url);

    getSavedMode(url.hostname, (savedMode) => {
      if (savedMode && !injected) {
        chrome.tabs.insertCSS(id, { file: 'invert.css', runAt: 'document_start' }, () => { injected = true });
      }
    });
  }

  if (changeInfo.status == 'complete') {
    injected = false;
  }
});
