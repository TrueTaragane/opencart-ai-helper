import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

// Base class for tree items
export class TreeItem extends vscode.TreeItem {
    constructor(
        public readonly label: string,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState,
        public readonly command?: vscode.Command
    ) {
        super(label, collapsibleState);
    }
}

// Provider for modules
export class ModulesProvider implements vscode.TreeDataProvider<TreeItem> {
    private _onDidChangeTreeData: vscode.EventEmitter<TreeItem | undefined | null | void> = new vscode.EventEmitter<TreeItem | undefined | null | void>();
    readonly onDidChangeTreeData: vscode.Event<TreeItem | undefined | null | void> = this._onDidChangeTreeData.event;

    refresh(): void {
        this._onDidChangeTreeData.fire();
    }

    getTreeItem(element: TreeItem): vscode.TreeItem {
        return element;
    }

    async getChildren(element?: TreeItem): Promise<TreeItem[]> {
        if (!element) {
            // Root elements
            return [
                new TreeItem('Generate Module', vscode.TreeItemCollapsibleState.None, {
                    command: 'opencart-ai-helper.genModule',
                    title: 'Generate Module',
                    arguments: []
                }),
                new TreeItem('Generate OCMod', vscode.TreeItemCollapsibleState.None, {
                    command: 'opencart-ai-helper.genOCMod',
                    title: 'Generate OCMod',
                    arguments: []
                }),
                new TreeItem('Generate Twig Template', vscode.TreeItemCollapsibleState.None, {
                    command: 'opencart-ai-helper.genTwig',
                    title: 'Generate Twig Template',
                    arguments: []
                }),
                new TreeItem('Generate TPL Template', vscode.TreeItemCollapsibleState.None, {
                    command: 'opencart-ai-helper.genTpl',
                    title: 'Generate TPL Template',
                    arguments: []
                }),
                new TreeItem('Open AI Assistant', vscode.TreeItemCollapsibleState.None, {
                    command: 'opencart-ai-helper.openWebview',
                    title: 'Open AI Assistant',
                    arguments: []
                })
            ];
        }
        
        return [];
    }
}

// Provider for snippets
export class SnippetsProvider implements vscode.TreeDataProvider<TreeItem> {
    private _onDidChangeTreeData: vscode.EventEmitter<TreeItem | undefined | null | void> = new vscode.EventEmitter<TreeItem | undefined | null | void>();
    readonly onDidChangeTreeData: vscode.Event<TreeItem | undefined | null | void> = this._onDidChangeTreeData.event;

    refresh(): void {
        this._onDidChangeTreeData.fire();
    }

    getTreeItem(element: TreeItem): vscode.TreeItem {
        return element;
    }

    async getChildren(element?: TreeItem): Promise<TreeItem[]> {
        if (!element) {
            // Root elements - snippet categories
            return [
                new TreeItem('PHP Snippets', vscode.TreeItemCollapsibleState.Collapsed),
                new TreeItem('Twig Snippets', vscode.TreeItemCollapsibleState.Collapsed),
                new TreeItem('TPL Snippets', vscode.TreeItemCollapsibleState.Collapsed),
                new TreeItem('XML Snippets', vscode.TreeItemCollapsibleState.Collapsed)
            ];
        }
        
        // Load snippets based on category
        if (element.label === 'PHP Snippets') {
            return this.getSnippetsFromFile('php.json');
        } else if (element.label === 'Twig Snippets') {
            return this.getSnippetsFromFile('twig.json');
        } else if (element.label === 'TPL Snippets') {
            return this.getSnippetsFromFile('tpl.json');
        } else if (element.label === 'XML Snippets') {
            return this.getSnippetsFromFile('xml.json');
        }
        
        return [];
    }
    
    private async getSnippetsFromFile(fileName: string): Promise<TreeItem[]> {
        try {
            const extensionPath = vscode.extensions.getExtension('opencart-ai-helper')?.extensionPath;
            if (!extensionPath) {
                return [];
            }
            
            const snippetsPath = path.join(extensionPath, 'snippets', fileName);
            if (!fs.existsSync(snippetsPath)) {
                return [];
            }
            
            const content = fs.readFileSync(snippetsPath, 'utf8');
            const snippets = JSON.parse(content);
            
            return Object.keys(snippets).map(key => {
                return new TreeItem(key, vscode.TreeItemCollapsibleState.None, {
                    command: 'opencart-ai-helper.insertSnippet',
                    title: 'Insert Snippet',
                    arguments: [key, snippets[key]]
                });
            });
        } catch (error) {
            console.error('Error loading snippets:', error);
            return [];
        }
    }
}

// Provider for chat
export class ChatProvider implements vscode.TreeDataProvider<TreeItem> {
    private _onDidChangeTreeData: vscode.EventEmitter<TreeItem | undefined | null | void> = new vscode.EventEmitter<TreeItem | undefined | null | void>();
    readonly onDidChangeTreeData: vscode.Event<TreeItem | undefined | null | void> = this._onDidChangeTreeData.event;

    refresh(): void {
        this._onDidChangeTreeData.fire();
    }

    getTreeItem(element: TreeItem): vscode.TreeItem {
        return element;
    }

    async getChildren(element?: TreeItem): Promise<TreeItem[]> {
        if (!element) {
            // Root elements
            return [
                new TreeItem('Open AI Chat', vscode.TreeItemCollapsibleState.None, {
                    command: 'opencart-ai-helper.openChat',
                    title: 'Open AI Chat',
                    arguments: []
                }),
                new TreeItem('Open AI Assistant', vscode.TreeItemCollapsibleState.None, {
                    command: 'opencart-ai-helper.openWebview',
                    title: 'Open AI Assistant',
                    arguments: []
                }),
                new TreeItem('Recent Conversations', vscode.TreeItemCollapsibleState.Collapsed)
            ];
        }
        
        if (element.label === 'Recent Conversations') {
            // Here you can load chat history if it's saved
            return [];
        }
        
        return [];
    }
}

// Provider for tools
export class ToolsProvider implements vscode.TreeDataProvider<TreeItem> {
    private _onDidChangeTreeData: vscode.EventEmitter<TreeItem | undefined | null | void> = new vscode.EventEmitter<TreeItem | undefined | null | void>();
    readonly onDidChangeTreeData: vscode.Event<TreeItem | undefined | null | void> = this._onDidChangeTreeData.event;

    refresh(): void {
        this._onDidChangeTreeData.fire();
    }

    getTreeItem(element: TreeItem): vscode.TreeItem {
        return element;
    }

    async getChildren(element?: TreeItem): Promise<TreeItem[]> {
        if (!element) {
            // Root elements
            return [
                new TreeItem('Index OpenCart Files', vscode.TreeItemCollapsibleState.None, {
                    command: 'opencart-ai-helper.indexOpenCart',
                    title: 'Index OpenCart Files',
                    arguments: []
                }),
                new TreeItem('Settings', vscode.TreeItemCollapsibleState.None, {
                    command: 'workbench.action.openSettings',
                    title: 'Settings',
                    arguments: ['opencartAIHelper']
                })
            ];
        }
        
        return [];
    }
}
