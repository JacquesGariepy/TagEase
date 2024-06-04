// background.js

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'openManageTagsPopup') {
    chrome.system.display.getInfo((displays) => {
      const primaryDisplay = displays.find(display => display.isPrimary);
      const screenWidth = primaryDisplay.workArea.width;
      const screenHeight = primaryDisplay.workArea.height;
      const width = 500;
      const height = 600;
      const top = Math.round((screenHeight - height) / 2);
      const left = Math.round((screenWidth - width) / 2);
      
      chrome.windows.create({
        url: chrome.runtime.getURL('popup.html'),
        type: 'popup',
        width: width,
        height: height,
        top: top,
        left: left
      });
    });
  }
});
