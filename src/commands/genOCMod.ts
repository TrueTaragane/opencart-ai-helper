import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { OCIndexer } from '../ocIndexer';

/**
 * Generate an OCMod
 * @param ocIndexer The OpenCart structure indexer
 */
export async function genOCMod(ocIndexer: OCIndexer) {
    try {
        // Get OCMod details from user
        const ocmodName = await vscode.window.showInputBox({
            prompt: 'Enter OCMod name',
            placeHolder: 'e.g., My Modification'
        });
        
        if (!ocmodName) {
            return;
        }
        
        const ocmodCode = await vscode.window.showInputBox({
            prompt: 'Enter OCMod code',
            placeHolder: 'e.g., my_modification'
        });
        
        if (!ocmodCode) {
            return;
        }
        
        const ocmodVersion = await vscode.window.showInputBox({
            prompt: 'Enter OCMod version',
            placeHolder: 'e.g., 1.0.0',
            value: '1.0.0'
        });
        
        if (!ocmodVersion) {
            return;
        }
        
        const ocmodAuthor = await vscode.window.showInputBox({
            prompt: 'Enter OCMod author',
            placeHolder: 'e.g., Your Name'
        });
        
        if (!ocmodAuthor) {
            return;
        }
        
        const ocmodLink = await vscode.window.showInputBox({
            prompt: 'Enter OCMod link',
            placeHolder: 'e.g., https://example.com'
        });
        
        if (!ocmodLink) {
            return;
        }
        
        // Get output path from settings
        const config = vscode.workspace.getConfiguration('opencartAIHelper');
        const outputPath = config.get<string>('outputPath', '.vscode/opencart-output');
        
        // Get workspace folder
        const workspaceFolders = vscode.workspace.workspaceFolders;
        if (!workspaceFolders) {
            vscode.window.showErrorMessage('No workspace folder found');
            return;
        }
        
        const workspaceFolder = workspaceFolders[0];
        const ocmodPath = path.join(workspaceFolder.uri.fsPath, outputPath);
        
        // Create output directory if it doesn't exist
        if (!fs.existsSync(ocmodPath)) {
            fs.mkdirSync(ocmodPath, { recursive: true });
        }
        
        // Create OCMod file
        const ocmodFile = path.join(ocmodPath, `${ocmodCode}.ocmod.xml`);
        const ocmodContent = `<?xml version="1.0" encoding="utf-8"?>
<modification>
    <name>${ocmodName}</name>
    <code>${ocmodCode}</code>
    <version>${ocmodVersion}</version>
    <author>${ocmodAuthor}</author>
    <link>${ocmodLink}</link>
    <file path="catalog/controller/common/header.php">
        <operation>
            <search><![CDATA[// Search text]]></search>
            <add position="after"><![CDATA[// Added text]]></add>
        </operation>
    </file>
</modification>`;
        
        fs.writeFileSync(ocmodFile, ocmodContent);
        
        // Show success message
        vscode.window.showInformationMessage(`OCMod ${ocmodName} generated successfully!`);
        
        // Open OCMod file
        const document = await vscode.workspace.openTextDocument(ocmodFile);
        await vscode.window.showTextDocument(document);
    } catch (error) {
        vscode.window.showErrorMessage(`Error generating OCMod: ${error instanceof Error ? error.message : String(error)}`);
    }
}
