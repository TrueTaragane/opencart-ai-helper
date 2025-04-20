// Get access to the VS Code API
const vscode = acquireVsCodeApi();

// Store state information
let state = {
    workingDir: '',
    openCartDir: '',
    llmProvider: 'openai',
    apiKey: '',
    ocVersion: 'auto',
    tokenCount: 0,
    messages: []
};

// Initialize the webview
window.addEventListener('load', () => {
    // Restore state if it exists
    const previousState = vscode.getState();
    if (previousState) {
        state = previousState;
        updateUI();
    }

    // Set up event listeners
    document.getElementById('sendButton')?.addEventListener('click', sendMessage);
    document.getElementById('uploadButton')?.addEventListener('click', uploadFile);
    document.getElementById('selectWorkingDirButton')?.addEventListener('click', selectWorkingDir);
    document.getElementById('selectOpenCartDirButton')?.addEventListener('click', selectOpenCartDir);
    document.getElementById('settingsButton')?.addEventListener('click', openSettings);
    document.getElementById('messageInput')?.addEventListener('keydown', handleKeyDown);
    document.getElementById('llmProvider')?.addEventListener('change', updateLLMProvider);
    document.getElementById('apiKey')?.addEventListener('change', updateAPIKey);
    document.getElementById('ocVersion')?.addEventListener('change', updateOCVersion);

    // Set up prompt library buttons
    const promptButtons = document.querySelectorAll('.prompt-item');
    promptButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const target = e.target as HTMLElement;
            if (target.textContent === '+ Add New') {
                addNewPrompt();
            } else {
                usePrompt(target.textContent || '');
            }
        });
    });
});

// Handle messages from the extension
window.addEventListener('message', event => {
    const message = event.data;
    
    switch (message.command) {
        case 'updateWorkingDir':
            state.workingDir = message.path;
            updateUI();
            break;
        case 'updateOpenCartDir':
            state.openCartDir = message.path;
            updateUI();
            break;
        case 'receiveMessage':
            addMessage('assistant', message.text);
            break;
        case 'updateTokenCount':
            state.tokenCount = message.count;
            updateUI();
            break;
    }
});

// Send a message to the AI
function sendMessage() {
    const messageInput = document.getElementById('messageInput') as HTMLTextAreaElement;
    const text = messageInput.value.trim();
    
    if (text) {
        addMessage('user', text);
        messageInput.value = '';
        
        // Send the message to the extension
        vscode.postMessage({
            command: 'sendMessage',
            text: text
        });
    }
}

// Handle file upload
function uploadFile() {
    vscode.postMessage({
        command: 'uploadFile'
    });
}

// Select working directory
function selectWorkingDir() {
    vscode.postMessage({
        command: 'selectWorkingDir'
    });
}

// Select OpenCart directory
function selectOpenCartDir() {
    vscode.postMessage({
        command: 'selectOpenCartDir'
    });
}

// Open settings
function openSettings() {
    vscode.postMessage({
        command: 'openSettings'
    });
}

// Handle Enter key in message input
function handleKeyDown(e: KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
}

// Update LLM provider
function updateLLMProvider(e: Event) {
    const select = e.target as HTMLSelectElement;
    state.llmProvider = select.value;
    vscode.setState(state);
}

// Update API key
function updateAPIKey(e: Event) {
    const input = e.target as HTMLInputElement;
    state.apiKey = input.value;
    vscode.setState(state);
}

// Update OpenCart version
function updateOCVersion(e: Event) {
    const select = e.target as HTMLSelectElement;
    state.ocVersion = select.value;
    vscode.setState(state);
}

// Add a new prompt to the library
function addNewPrompt() {
    // TODO: Implement adding new prompts
    vscode.window.showInformationMessage('Adding new prompts is not yet implemented');
}

// Use a prompt from the library
function usePrompt(promptName: string) {
    // TODO: Implement using prompts
    const messageInput = document.getElementById('messageInput') as HTMLTextAreaElement;
    
    switch (promptName) {
        case 'Payment Module':
            messageInput.value = 'Create a payment module for OpenCart with the following details:';
            break;
        case 'Shipping Module':
            messageInput.value = 'Create a shipping module for OpenCart with the following details:';
            break;
        case 'Catalog Module':
            messageInput.value = 'Create a catalog module for OpenCart with the following details:';
            break;
        case 'Order Module':
            messageInput.value = 'Create an order module for OpenCart with the following details:';
            break;
        default:
            messageInput.value = promptName;
    }
    
    messageInput.focus();
}

// Add a message to the chat
function addMessage(role: 'user' | 'assistant', text: string) {
    // Add to state
    state.messages.push({ role, text });
    vscode.setState(state);
    
    // Add to UI
    const chatMessages = document.getElementById('chatMessages');
    if (chatMessages) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${role}`;
        
        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content';
        
        const paragraph = document.createElement('p');
        paragraph.textContent = text;
        
        contentDiv.appendChild(paragraph);
        messageDiv.appendChild(contentDiv);
        chatMessages.appendChild(messageDiv);
        
        // Scroll to bottom
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
}

// Update the UI based on the current state
function updateUI() {
    // Update working directory
    const workingDirInput = document.getElementById('workingDir') as HTMLInputElement;
    if (workingDirInput) {
        workingDirInput.value = state.workingDir || '';
    }
    
    // Update OpenCart directory
    const openCartDirInput = document.getElementById('openCartDir') as HTMLInputElement;
    if (openCartDirInput) {
        openCartDirInput.value = state.openCartDir || '';
    }
    
    // Update LLM provider
    const llmProviderSelect = document.getElementById('llmProvider') as HTMLSelectElement;
    if (llmProviderSelect) {
        llmProviderSelect.value = state.llmProvider;
    }
    
    // Update API key
    const apiKeyInput = document.getElementById('apiKey') as HTMLInputElement;
    if (apiKeyInput) {
        apiKeyInput.value = state.apiKey;
    }
    
    // Update OpenCart version
    const ocVersionSelect = document.getElementById('ocVersion') as HTMLSelectElement;
    if (ocVersionSelect) {
        ocVersionSelect.value = state.ocVersion;
    }
    
    // Update token counter
    const tokenCounter = document.querySelector('.token-counter span');
    if (tokenCounter) {
        tokenCounter.textContent = `Tokens: ${state.tokenCount}`;
    }
    
    // Update chat messages
    const chatMessages = document.getElementById('chatMessages');
    if (chatMessages && state.messages.length > 0 && chatMessages.children.length === 0) {
        // Only rebuild messages if they're not already displayed
        chatMessages.innerHTML = '';
        state.messages.forEach(message => {
            addMessage(message.role, message.text);
        });
    }
}
