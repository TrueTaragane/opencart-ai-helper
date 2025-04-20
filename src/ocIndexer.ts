import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Class for indexing OpenCart structure
 */
export class OCIndexer {
    private _isIndexed: boolean = false;
    private _version: string = 'unknown';
    private _controllers: string[] = [];
    private _models: string[] = [];
    private _views: string[] = [];
    private _languages: string[] = [];

    /**
     * Check if OpenCart is indexed
     */
    public isIndexed(): boolean {
        return this._isIndexed;
    }

    /**
     * Get OpenCart version
     */
    public getVersion(): string {
        return this._version;
    }

    /**
     * Get indexed controllers
     */
    public getControllers(): string[] {
        return this._controllers;
    }

    /**
     * Get indexed models
     */
    public getModels(): string[] {
        return this._models;
    }

    /**
     * Get indexed views
     */
    public getViews(): string[] {
        return this._views;
    }

    /**
     * Get indexed languages
     */
    public getLanguages(): string[] {
        return this._languages;
    }

    /**
     * Index OpenCart structure
     */
    public async indexOpenCartStructure(): Promise<void> {
        try {
            // Show progress
            await vscode.window.withProgress({
                location: vscode.ProgressLocation.Notification,
                title: "Indexing OpenCart",
                cancellable: true
            }, async (progress, token) => {
                // Get OpenCart source path from settings
                const config = vscode.workspace.getConfiguration('opencartAIHelper');
                const ocSourcePath = config.get<string>('ocSourcePath', '.vscode/opencart-src');
                
                // Get workspace folder
                const workspaceFolders = vscode.workspace.workspaceFolders;
                if (!workspaceFolders) {
                    throw new Error('No workspace folder found');
                }
                
                const workspaceFolder = workspaceFolders[0];
                const ocPath = path.join(workspaceFolder.uri.fsPath, ocSourcePath);
                
                // Check if OpenCart source path exists
                if (!fs.existsSync(ocPath)) {
                    throw new Error(`OpenCart source path not found: ${ocPath}`);
                }
                
                // Reset indexed data
                this._controllers = [];
                this._models = [];
                this._views = [];
                this._languages = [];
                
                // Detect OpenCart version
                progress.report({ message: "Detecting OpenCart version..." });
                this._version = await this._detectOpenCartVersion(ocPath);
                
                // Index controllers
                progress.report({ message: "Indexing controllers..." });
                await this._indexControllers(ocPath);
                
                // Index models
                progress.report({ message: "Indexing models..." });
                await this._indexModels(ocPath);
                
                // Index views
                progress.report({ message: "Indexing views..." });
                await this._indexViews(ocPath);
                
                // Index languages
                progress.report({ message: "Indexing languages..." });
                await this._indexLanguages(ocPath);
                
                // Set indexed flag
                this._isIndexed = true;
                
                // Show success message
                vscode.window.showInformationMessage(`OpenCart ${this._version} indexed successfully!`);
            });
        } catch (error) {
            this._isIndexed = false;
            vscode.window.showErrorMessage(`Error indexing OpenCart: ${error instanceof Error ? error.message : String(error)}`);
        }
    }

    /**
     * Detect OpenCart version
     */
    private async _detectOpenCartVersion(ocPath: string): Promise<string> {
        try {
            // Check for index.php file
            const indexPath = path.join(ocPath, 'index.php');
            if (!fs.existsSync(indexPath)) {
                throw new Error('index.php not found');
            }
            
            // Read index.php file
            const indexContent = fs.readFileSync(indexPath, 'utf8');
            
            // Check for version constant
            const versionMatch = indexContent.match(/define\s*\(\s*['"]VERSION['"]\s*,\s*['"]([^'"]+)['"]\s*\)/);
            if (versionMatch && versionMatch[1]) {
                return versionMatch[1];
            }
            
            // Check for OpenCart 2.x structure
            if (fs.existsSync(path.join(ocPath, 'system', 'framework.php'))) {
                return '2.x';
            }
            
            // Check for OpenCart 3.x structure
            if (fs.existsSync(path.join(ocPath, 'system', 'startup.php'))) {
                return '3.x';
            }
            
            return 'unknown';
        } catch (error) {
            console.error('Error detecting OpenCart version:', error);
            return 'unknown';
        }
    }

    /**
     * Index controllers
     */
    private async _indexControllers(ocPath: string): Promise<void> {
        try {
            // Check for admin/controller directory
            const adminControllerPath = path.join(ocPath, 'admin', 'controller');
            if (fs.existsSync(adminControllerPath)) {
                this._indexDirectory(adminControllerPath, '.php', this._controllers, 'admin/controller/');
            }
            
            // Check for catalog/controller directory
            const catalogControllerPath = path.join(ocPath, 'catalog', 'controller');
            if (fs.existsSync(catalogControllerPath)) {
                this._indexDirectory(catalogControllerPath, '.php', this._controllers, 'catalog/controller/');
            }
        } catch (error) {
            console.error('Error indexing controllers:', error);
        }
    }

    /**
     * Index models
     */
    private async _indexModels(ocPath: string): Promise<void> {
        try {
            // Check for admin/model directory
            const adminModelPath = path.join(ocPath, 'admin', 'model');
            if (fs.existsSync(adminModelPath)) {
                this._indexDirectory(adminModelPath, '.php', this._models, 'admin/model/');
            }
            
            // Check for catalog/model directory
            const catalogModelPath = path.join(ocPath, 'catalog', 'model');
            if (fs.existsSync(catalogModelPath)) {
                this._indexDirectory(catalogModelPath, '.php', this._models, 'catalog/model/');
            }
        } catch (error) {
            console.error('Error indexing models:', error);
        }
    }

    /**
     * Index views
     */
    private async _indexViews(ocPath: string): Promise<void> {
        try {
            // Check for admin/view/template directory
            const adminViewPath = path.join(ocPath, 'admin', 'view', 'template');
            if (fs.existsSync(adminViewPath)) {
                this._indexDirectory(adminViewPath, '.twig', this._views, 'admin/view/template/');
                this._indexDirectory(adminViewPath, '.tpl', this._views, 'admin/view/template/');
            }
            
            // Check for catalog/view/theme directory
            const catalogViewPath = path.join(ocPath, 'catalog', 'view', 'theme');
            if (fs.existsSync(catalogViewPath)) {
                this._indexDirectory(catalogViewPath, '.twig', this._views, 'catalog/view/theme/');
                this._indexDirectory(catalogViewPath, '.tpl', this._views, 'catalog/view/theme/');
            }
        } catch (error) {
            console.error('Error indexing views:', error);
        }
    }

    /**
     * Index languages
     */
    private async _indexLanguages(ocPath: string): Promise<void> {
        try {
            // Check for admin/language directory
            const adminLanguagePath = path.join(ocPath, 'admin', 'language');
            if (fs.existsSync(adminLanguagePath)) {
                this._indexDirectory(adminLanguagePath, '.php', this._languages, 'admin/language/');
            }
            
            // Check for catalog/language directory
            const catalogLanguagePath = path.join(ocPath, 'catalog', 'language');
            if (fs.existsSync(catalogLanguagePath)) {
                this._indexDirectory(catalogLanguagePath, '.php', this._languages, 'catalog/language/');
            }
        } catch (error) {
            console.error('Error indexing languages:', error);
        }
    }

    /**
     * Index directory recursively
     */
    private _indexDirectory(dirPath: string, extension: string, result: string[], prefix: string): void {
        try {
            const files = fs.readdirSync(dirPath);
            
            for (const file of files) {
                const filePath = path.join(dirPath, file);
                const stat = fs.statSync(filePath);
                
                if (stat.isDirectory()) {
                    this._indexDirectory(filePath, extension, result, prefix + file + '/');
                } else if (file.endsWith(extension)) {
                    result.push(prefix + file);
                }
            }
        } catch (error) {
            console.error(`Error indexing directory ${dirPath}:`, error);
        }
    }
}
