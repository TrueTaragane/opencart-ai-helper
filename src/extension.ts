import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

// Import commands
import { genModule } from './commands/genModule';
import { genOCMod } from './commands/genOCMod';
import { genTwig } from './commands/genTwig';
import { genTpl } from './commands/genTpl';
import { openChat } from './commands/openChat';
import { OCIndexer } from './ocIndexer';
import { WebviewProvider } from './webview/webviewProvider';

// Import tree view providers
import { ModulesProvider, SnippetsProvider, ChatProvider, ToolsProvider } from './views/treeViewProviders';

export function activate(context: vscode.ExtensionContext) {
    console.log('OpenCart AI Helper is now active!');

    // Initialize OpenCart indexer
    const ocIndexer = new OCIndexer();

    // Initialize tree view providers
    const modulesProvider = new ModulesProvider();
    const snippetsProvider = new SnippetsProvider();
    const chatProvider = new ChatProvider();
    const toolsProvider = new ToolsProvider();

    // Register tree views
    vscode.window.registerTreeDataProvider('opencartModules', modulesProvider);
    vscode.window.registerTreeDataProvider('opencartSnippets', snippetsProvider);
    vscode.window.registerTreeDataProvider('opencartChat', chatProvider);
    vscode.window.registerTreeDataProvider('opencartTools', toolsProvider);

    // Initialize webview provider
    const webviewProvider = new WebviewProvider(context.extensionUri);

    // Register commands
    const moduleCommand = vscode.commands.registerCommand('opencart-ai-helper.genModule', async () => {
        // Ensure OpenCart is indexed before proceeding
        if (!ocIndexer.isIndexed()) {
            const result = await vscode.window.showWarningMessage(
                'OpenCart files need to be indexed before generating modules.',
                'Index Now', 'Cancel'
            );

            if (result === 'Index Now') {
                await ocIndexer.indexOpenCartStructure();
            } else {
                return; // User cancelled
            }
        }

        genModule(ocIndexer);
    });

    const ocmodCommand = vscode.commands.registerCommand('opencart-ai-helper.genOCMod', async () => {
        // Ensure OpenCart is indexed before proceeding
        if (!ocIndexer.isIndexed()) {
            const result = await vscode.window.showWarningMessage(
                'OpenCart files need to be indexed before generating OCMod.',
                'Index Now', 'Cancel'
            );

            if (result === 'Index Now') {
                await ocIndexer.indexOpenCartStructure();
            } else {
                return; // User cancelled
            }
        }

        genOCMod(ocIndexer);
    });

    const twigCommand = vscode.commands.registerCommand('opencart-ai-helper.genTwig', async () => {
        // Ensure OpenCart is indexed before proceeding
        if (!ocIndexer.isIndexed()) {
            const result = await vscode.window.showWarningMessage(
                'OpenCart files need to be indexed before generating Twig templates.',
                'Index Now', 'Cancel'
            );

            if (result === 'Index Now') {
                await ocIndexer.indexOpenCartStructure();
            } else {
                return; // User cancelled
            }
        }

        genTwig(ocIndexer);
    });

    const tplCommand = vscode.commands.registerCommand('opencart-ai-helper.genTpl', async () => {
        // Ensure OpenCart is indexed before proceeding
        if (!ocIndexer.isIndexed()) {
            const result = await vscode.window.showWarningMessage(
                'OpenCart files need to be indexed before generating TPL templates.',
                'Index Now', 'Cancel'
            );

            if (result === 'Index Now') {
                await ocIndexer.indexOpenCartStructure();
            } else {
                return; // User cancelled
            }
        }

        genTpl(ocIndexer);
    });

    const chatCommand = vscode.commands.registerCommand('opencart-ai-helper.openChat', () => {
        openChat();
    });

    const webviewCommand = vscode.commands.registerCommand('opencart-ai-helper.openWebview', () => {
        webviewProvider.show();
    });

    // Register index command
    const indexCommand = vscode.commands.registerCommand('opencart-ai-helper.indexOpenCart', () => {
        ocIndexer.indexOpenCartStructure();
    });

    // Register snippet insertion command
    const insertSnippetCommand = vscode.commands.registerCommand('opencart-ai-helper.insertSnippet', (snippetName: string, snippet: any) => {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            const position = editor.selection.active;
            const snippetText = snippet.body.join('\\n');
            editor.edit(editBuilder => {
                editBuilder.insert(position, snippetText);
            });
        } else {
            vscode.window.showErrorMessage('No active editor found. Please open a file to insert the snippet.');
        }
    });

    // Register refresh commands
    const refreshModulesCommand = vscode.commands.registerCommand('opencart-ai-helper.refreshModules', () => {
        modulesProvider.refresh();
    });

    const refreshSnippetsCommand = vscode.commands.registerCommand('opencart-ai-helper.refreshSnippets', () => {
        snippetsProvider.refresh();
    });

    const refreshChatCommand = vscode.commands.registerCommand('opencart-ai-helper.refreshChat', () => {
        chatProvider.refresh();
    });

    const refreshToolsCommand = vscode.commands.registerCommand('opencart-ai-helper.refreshTools', () => {
        toolsProvider.refresh();
    });

    // Add commands to context subscriptions
    context.subscriptions.push(moduleCommand);
    context.subscriptions.push(ocmodCommand);
    context.subscriptions.push(twigCommand);
    context.subscriptions.push(tplCommand);
    context.subscriptions.push(chatCommand);
    context.subscriptions.push(webviewCommand);
    context.subscriptions.push(indexCommand);
    context.subscriptions.push(insertSnippetCommand);
    context.subscriptions.push(refreshModulesCommand);
    context.subscriptions.push(refreshSnippetsCommand);
    context.subscriptions.push(refreshChatCommand);
    context.subscriptions.push(refreshToolsCommand);
}

export function deactivate() {}
