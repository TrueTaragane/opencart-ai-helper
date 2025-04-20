import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

export class WebviewProvider {
    private _panel: vscode.WebviewPanel | undefined;
    private _extensionUri: vscode.Uri;

    constructor(extensionUri: vscode.Uri) {
        this._extensionUri = extensionUri;
    }

    public show() {
        if (this._panel) {
            // If we already have a panel, show it
            this._panel.reveal(vscode.ViewColumn.One);
            return;
        }

        // Create a new panel
        this._panel = vscode.window.createWebviewPanel(
            'opencartAIHelper',
            'OpenCart AI Helper',
            vscode.ViewColumn.One,
            {
                enableScripts: true,
                retainContextWhenHidden: true,
                localResourceRoots: [
                    vscode.Uri.joinPath(this._extensionUri, 'resources'),
                    vscode.Uri.joinPath(this._extensionUri, 'dist')
                ]
            }
        );

        // Set the webview's HTML content
        this._panel.webview.html = this._getWebviewContent(this._panel.webview);

        // Handle messages from the webview
        this._panel.webview.onDidReceiveMessage(
            message => {
                switch (message.command) {
                    case 'sendMessage':
                        this._handleSendMessage(message.text);
                        return;
                    case 'uploadFile':
                        this._handleUploadFile();
                        return;
                    case 'selectWorkingDir':
                        this._handleSelectWorkingDir();
                        return;
                    case 'selectOpenCartDir':
                        this._handleSelectOpenCartDir();
                        return;
                    case 'openSettings':
                        this._handleOpenSettings();
                        return;
                }
            },
            undefined,
            []
        );

        // Reset when the panel is disposed
        this._panel.onDidDispose(
            () => {
                this._panel = undefined;
            },
            null,
            []
        );
    }

    private _getWebviewContent(webview: vscode.Webview): string {
        // Get the local path to main script
        const scriptUri = webview.asWebviewUri(
            vscode.Uri.joinPath(this._extensionUri, 'dist', 'webview.js')
        );

        // Get the local path to css styles
        const styleUri = webview.asWebviewUri(
            vscode.Uri.joinPath(this._extensionUri, 'resources', 'webview.css')
        );

        // Get the local path to the rocket icon
        const rocketIconUri = webview.asWebviewUri(
            vscode.Uri.joinPath(this._extensionUri, 'resources', 'rocket.svg')
        );

        // Use a nonce to only allow specific scripts to be run
        const nonce = this._getNonce();

        return /*html*/`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>OpenCart AI Helper</title>
                <link href="${styleUri}" rel="stylesheet">
                <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource}; script-src 'nonce-${nonce}'; img-src ${webview.cspSource} https:;">
            </head>
            <body>
                <div class="container">
                    <header class="header">
                        <div class="header-left">
                            <img src="${rocketIconUri}" alt="Rocket Icon" class="rocket-icon">
                            <h1>OpenCart AI Helper</h1>
                        </div>
                        <div class="header-right">
                            <div class="version-selector">
                                <select id="ocVersion">
                                    <option value="auto">Auto-detect</option>
                                    <option value="2.0">OpenCart 2.0</option>
                                    <option value="2.1">OpenCart 2.1</option>
                                    <option value="2.2">OpenCart 2.2</option>
                                    <option value="2.3">OpenCart 2.3</option>
                                    <option value="3.0">OpenCart 3.0</option>
                                    <option value="4.0">OpenCart 4.0</option>
                                </select>
                            </div>
                            <div class="token-counter">
                                <span>Tokens: 0</span>
                            </div>
                            <button id="settingsButton" class="icon-button">⚙️</button>
                        </div>
                    </header>
                    
                    <div class="instructions">
                        <div class="instruction-item">
                            <h3>1. Set Working Directory</h3>
                            <p>Select a directory where generated files will be saved.</p>
                            <div class="instruction-action">
                                <input type="text" id="workingDir" readonly placeholder="Not selected">
                                <button id="selectWorkingDirButton">Select</button>
                            </div>
                        </div>
                        
                        <div class="instruction-item">
                            <h3>2. Set OpenCart Source Directory</h3>
                            <p>Select a directory containing OpenCart source files.</p>
                            <div class="instruction-action">
                                <input type="text" id="openCartDir" readonly placeholder="Not selected">
                                <button id="selectOpenCartDirButton">Select</button>
                            </div>
                        </div>
                        
                        <div class="instruction-item">
                            <h3>3. Configure LLM Provider</h3>
                            <p>Select an LLM provider and enter your API key.</p>
                            <div class="instruction-action">
                                <select id="llmProvider">
                                    <option value="openai">OpenAI</option>
                                    <option value="gemini">Google Gemini</option>
                                    <option value="mistral">Mistral AI</option>
                                    <option value="openrouter">OpenRouter</option>
                                    <option value="llama">Llama</option>
                                </select>
                                <input type="password" id="apiKey" placeholder="API Key">
                            </div>
                        </div>
                    </div>
                    
                    <div class="prompt-library">
                        <h3>Prompt Library</h3>
                        <div class="prompt-list">
                            <button class="prompt-item">Payment Module</button>
                            <button class="prompt-item">Shipping Module</button>
                            <button class="prompt-item">Catalog Module</button>
                            <button class="prompt-item">Order Module</button>
                            <button class="prompt-item">+ Add New</button>
                        </div>
                    </div>
                    
                    <div class="chat-container">
                        <div class="chat-messages" id="chatMessages">
                            <div class="message assistant">
                                <div class="message-content">
                                    <p>Hello! I'm your OpenCart AI Helper. I can help you create modules, OCMod modifiers, and templates for OpenCart. What would you like to do today?</p>
                                </div>
                            </div>
                        </div>
                        
                        <div class="chat-input">
                            <textarea id="messageInput" placeholder="Type your message here..."></textarea>
                            <div class="chat-buttons">
                                <button id="uploadButton" class="icon-button">📎</button>
                                <button id="sendButton">Send</button>
                            </div>
                        </div>
                    </div>
                </div>
                
                <script nonce="${nonce}" src="${scriptUri}"></script>
            </body>
            </html>
        `;
    }

    private _getNonce() {
        let text = '';
        const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (let i = 0; i < 32; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
    }

    private _handleSendMessage(text: string) {
        // Handle sending a message to the AI
        vscode.window.showInformationMessage(`Message sent: ${text}`);
        // TODO: Implement actual AI communication
    }

    private _handleUploadFile() {
        // Handle file upload
        vscode.window.showOpenDialog({
            canSelectMany: false,
            openLabel: 'Select File',
            filters: {
                'All Files': ['*']
            }
        }).then(fileUri => {
            if (fileUri && fileUri[0]) {
                vscode.window.showInformationMessage(`File selected: ${fileUri[0].fsPath}`);
                // TODO: Implement actual file handling
            }
        });
    }

    private _handleSelectWorkingDir() {
        // Handle selecting working directory
        vscode.window.showOpenDialog({
            canSelectFiles: false,
            canSelectFolders: true,
            canSelectMany: false,
            openLabel: 'Select Working Directory'
        }).then(folderUri => {
            if (folderUri && folderUri[0]) {
                const folderPath = folderUri[0].fsPath;
                vscode.workspace.getConfiguration('opencartAIHelper').update('outputPath', folderPath, vscode.ConfigurationTarget.Workspace);
                vscode.window.showInformationMessage(`Working directory set to: ${folderPath}`);
                
                // Update the webview
                if (this._panel) {
                    this._panel.webview.postMessage({ command: 'updateWorkingDir', path: folderPath });
                }
            }
        });
    }

    private _handleSelectOpenCartDir() {
        // Handle selecting OpenCart directory
        vscode.window.showOpenDialog({
            canSelectFiles: false,
            canSelectFolders: true,
            canSelectMany: false,
            openLabel: 'Select OpenCart Directory'
        }).then(folderUri => {
            if (folderUri && folderUri[0]) {
                const folderPath = folderUri[0].fsPath;
                vscode.workspace.getConfiguration('opencartAIHelper').update('ocSourcePath', folderPath, vscode.ConfigurationTarget.Workspace);
                vscode.window.showInformationMessage(`OpenCart directory set to: ${folderPath}`);
                
                // Update the webview
                if (this._panel) {
                    this._panel.webview.postMessage({ command: 'updateOpenCartDir', path: folderPath });
                }
                
                // Trigger indexing
                vscode.commands.executeCommand('opencart-ai-helper.indexOpenCart');
            }
        });
    }

    private _handleOpenSettings() {
        // Open extension settings
        vscode.commands.executeCommand('workbench.action.openSettings', 'opencartAIHelper');
    }
}
