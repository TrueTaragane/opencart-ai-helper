import * as vscode from 'vscode';

/**
 * Open AI chat
 */
export function openChat() {
    // Open webview instead of simple chat
    vscode.commands.executeCommand('opencart-ai-helper.openWebview');
}
