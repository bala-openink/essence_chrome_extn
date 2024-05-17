// Function to create and append the icon
function createIcon() {
    // Create a new div element for the icon
    const iconDiv = document.createElement('div');

    // Style the div element (customize this based on your needs)
    iconDiv.style.position = 'fixed';
    iconDiv.style.zIndex = '2147483646';
    iconDiv.style.bottom = '20px';    // Initial top position
    iconDiv.style.right = '20px';  // Adjust the right position
    iconDiv.style.width = '45px';   // Adjust width
    iconDiv.style.height = '45px';  // Adjust height
    iconDiv.style.padding = '2px';
    iconDiv.style.background = '#E6E9F5'; // Example background color
    iconDiv.style.borderColor = '#e6e4ec';
    iconDiv.style.borderWidth = '0px';
    iconDiv.style.borderRadius = '10px';
    iconDiv.style.boxShadow = '0 2px 5px rgba(230, 233, 245, 0.7)'; // Shadow effect
    iconDiv.style.cursor = 'pointer'; // Change cursor to pointer

    // Append the icon div to the document body
    document.body.appendChild(iconDiv);

    const icon = document.createElement('img');
    icon.src = 'https://essence-public.s3.amazonaws.com/icon_48.png'
    icon.style.width = '40px !important'; // Adjust the size of the icon as needed
    icon.style.height = '40px !important';
    icon.style.maxWidth = '40px !important';
    icon.style.maxHeight = '40px !important';
    icon.style.overflow = 'hidden';
    iconDiv.appendChild(icon);

    // Add a callback function to be executed after the animation completes
    const animationEndCallback = () => {
        iconDiv.style.bottom = '20px'; // Reset the top position after animation
        iconDiv.removeEventListener('animationend', animationEndCallback); // Remove the event listener
    };

    // Move the icon above its starting position and apply the animation
    iconDiv.style.bottom = '100px'; // Starting position for the animation
    iconDiv.style.transition = 'bottom 0.5s ease-out, opacity 0.5s ease-out'; // Set transition properties
    iconDiv.style.opacity = '0'; // Start with opacity 0

    // Wait for the next frame to trigger the animation
    requestAnimationFrame(() => {
        iconDiv.style.bottom = '20px'; // Final position for the animation
        iconDiv.style.opacity = '1'; // End with opacity 1
        iconDiv.addEventListener('transitionend', animationEndCallback); // Add event listener for animation end
    });
    // Add event listener for click events
    iconDiv.addEventListener('click', () => {
        //chrome.runtime.sendMessage({ action: 'triggerBrowserAction' });
        chrome.runtime.sendMessage({ action: 'openPopup' });
    });
}

// Function to inject the content script after DOM has loaded
function injectContentScript() {
    // Check if the DOMContentLoaded event has already occurred
    if (document.readyState === "complete" || document.readyState === "interactive") {
        // If DOM is already loaded, inject the content script immediately
        createIcon();
    } else {
        // Otherwise, wait for the DOMContentLoaded event to inject the content script
        document.addEventListener("DOMContentLoaded", createIcon);
    }
}

// Call the function to inject the content script
injectContentScript();