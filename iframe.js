function createIframe() {
    // Create a new iframe element
    const iframe = document.createElement('iframe');

    // Set attributes for the iframe
    iframe.src = chrome.runtime.getURL('popup.html');
    iframe.style.cssText = `
        position: absolute;
        top: 0px; /* Align to the top */
        right: 0px; /* Adjust the right margin */
        transform: translate(0, 0); /* Remove transform */
        background: white;
        border: 1px solid #E6E9F5;
        z-index: 2147483647; /* Ensure the popup is above other elements */
        box-shadow: 0 0 5px #E6E9F5;
        width: 502px;
        height: 300px;
        overflow: hidden;
    `;
    
    // Append the iframe to the document body
    document.body.appendChild(iframe);
    
    // Add CSS styles from external file
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.href = chrome.runtime.getURL('css/styles.css');
    document.head.appendChild(link);
    
    // Add event listener to handle close button click
    iframe.contentWindow.addEventListener('message', (event) => {
        if (event.data.type === 'closePopup') {
            // Remove the iframe
            iframe.remove();
        }
    });
    
    // Listen for the message from the iframe
    window.addEventListener('message', (event) => {
        if (event.data.type === 'contentHeight') {
            // Adjust the iframe height based on the received content height
            iframe.style.height = `${event.data.height}px`;
        }
        if (event.data.type === 'closePopup') {
            // Remove the iframe when close message is received
            iframe.remove();
        }
    });
}

createIframe()