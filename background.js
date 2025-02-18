chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if (message.type === 'phishingDetected') {
        chrome.windows.create({
            url: 'phishing_warning.html?url=' + encodeURIComponent(message.url),
            type: 'popup',
            width: 400,
            height: 300
        });
    }
});
