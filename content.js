// Select all anchor tags on the page
const links = document.querySelectorAll('a');

// Load the user's setting from local storage
chrome.storage.sync.get(['disablePhishingLinks'], function (result) {
    const disablePhishingLinks = result.disablePhishingLinks ?? true; // Default to true if not set

    // Apply a class to each link and check if it's a phishing URL
    links.forEach(link => {
        link.classList.add('highlight-link');
        checkIfPhishing(link.href, link, disablePhishingLinks);
    });
});

function checkIfPhishing(url, linkElement, disablePhishingLinks) {
    const cleanUrl = new URL(url).origin; // Normalize the URL

    fetch('http://<server-address>:5000/predict', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ url: cleanUrl })
    })
    .then(response => response.json())
    .then(data => {
        if (data.prediction === 'PHISHING') {
            // Create a wrapper around the link to handle events
            const wrapper = document.createElement('span');
            wrapper.className = 'phishing-wrapper';

            // Move the link inside the wrapper
            linkElement.parentNode.insertBefore(wrapper, linkElement);
            wrapper.appendChild(linkElement);

            // Apply phishing styles to the link
            linkElement.classList.add('phishing-link');
            if (disablePhishingLinks) {
                linkElement.style.pointerEvents = 'none'; // Disable clicking
                linkElement.style.color = 'red'; // Visual indicator
            }

            // Add tooltip logic to the wrapper
            wrapper.addEventListener('mouseover', (event) => showTooltip(event, linkElement));
            wrapper.addEventListener('mouseout', hideTooltip);
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function showTooltip(event, linkElement) {
    const tooltip = document.createElement('div');
    tooltip.className = 'phishing-tooltip';
    tooltip.innerText = 'Phishing Warning!';
    document.body.appendChild(tooltip);

    const rect = linkElement.getBoundingClientRect();
    tooltip.style.left = `${rect.left + window.pageXOffset}px`;
    tooltip.style.top = `${rect.top + window.pageYOffset - tooltip.offsetHeight}px`;

    event.target._tooltip = tooltip;
}

function hideTooltip(event) {
    const tooltip = event.target._tooltip;
    if (tooltip) {
        tooltip.remove();
        event.target._tooltip = null;
    }
}
