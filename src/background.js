// Background script for QOL Extensions
console.log('QOL Extensions background script loaded');

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log('Background script received message:', request);
    
    // Handle different extension actions
    switch (request.action) {
        case 'checkGrammar':
            // Forward to grammar checker extension
            handleGrammarCheck(request.text)
                .then(result => sendResponse({ result }))
                .catch(error => sendResponse({ error: error.message }));
            return true; // Will respond asynchronously
            
        default:
            console.warn('Unknown action:', request.action);
            sendResponse({ error: 'Unknown action' });
    }
});

// Handle grammar check request
async function handleGrammarCheck(text) {
    try {
        // This is just a placeholder - actual implementation will be in the extension
        console.log('Handling grammar check for text:', text);
        return 'Grammar check result will be implemented in the extension';
    } catch (error) {
        console.error('Error in handleGrammarCheck:', error);
        throw error;
    }
} 