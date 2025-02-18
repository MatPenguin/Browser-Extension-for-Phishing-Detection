document.addEventListener('DOMContentLoaded', function () {
    // Load the saved setting
    chrome.storage.sync.get(['disablePhishingLinks'], function (result) {
        document.getElementById('toggleDisablePhishingLinks').checked =
            result.disablePhishingLinks ?? true; // Default to true if not set
    });

    // Save the setting when the button is clicked
    document.getElementById('saveSettings').addEventListener('click', function () {
        const disablePhishingLinks = document.getElementById('toggleDisablePhishingLinks').checked;
        chrome.storage.sync.set({ disablePhishingLinks: disablePhishingLinks }, function () {
            console.log('Settings saved:', disablePhishingLinks);
        });
    });
});
