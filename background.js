// background.js

chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.set({ tags: {} });
  });
  