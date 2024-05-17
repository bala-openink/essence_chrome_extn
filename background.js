chrome.action.onClicked.addListener(() => {
  console.log("chrome.action.onClicked.addListener triggered");

  // Function to inject iframe script into the active tab
  function injectContentScript(tabId) {
    chrome.scripting.executeScript({
      target: { tabId: tabId },
      files: ['iframe.js']
    });
  }

  // Query for the active tab and inject content.js
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs.length > 0) {
      injectContentScript(tabs[0].id);
    } else {
      console.error('No active tabs found.');
    }
  });

});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'openPopup') {
      openIframe(sender.tab.id);
  }
});

function openIframe(tabId) {
  chrome.scripting.executeScript({
      target: { tabId: tabId },
      files: ['iframe.js']
  });
}