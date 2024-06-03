// i18n.js

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('[data-i18n]').forEach(elem => {
      const messageKey = elem.getAttribute('data-i18n');
      elem.textContent = chrome.i18n.getMessage(messageKey);
    });
  
    document.querySelectorAll('[data-i18n-placeholder]').forEach(elem => {
      const messageKey = elem.getAttribute('data-i18n-placeholder');
      elem.placeholder = chrome.i18n.getMessage(messageKey);
    });
  });
  