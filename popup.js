'use strict';

function getCurrentTabUrl(callback) {
  var queryInfo = {
    active: true,
    currentWindow: true
  };

  chrome.tabs.query(queryInfo, (tabs) => {
    var tab = tabs[0];
    console.assert(typeof tab.url == 'string', 'tab.url should be a string');

    var url = new URL(tab.url);
    callback(url.hostname);
  });
}

function getSavedMode(url, callback) {
  chrome.storage.sync.get(url, (items) => {
    callback(chrome.runtime.lastError ? null : items[url]);
  });
}

function saveMode(url, color) {
  var items = {};
  items[url] = color;
  chrome.storage.sync.set(items);
}

document.addEventListener('DOMContentLoaded', () => {
  getCurrentTabUrl((url) => {
    var switcher = document.getElementById('switcher');

    getSavedMode(url, (savedMode) => {
      switcher.checked = savedMode;
    });

    switcher.addEventListener('change', (e) => {
      saveMode(url, e.target.checked);
      chrome.tabs.reload();
      setTimeout(window.close, 1000);
    });
  });
});
