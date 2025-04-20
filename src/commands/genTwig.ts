import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { OCIndexer } from '../ocIndexer';

/**
 * Generate a Twig template
 * @param ocIndexer The OpenCart structure indexer
 */
export async function genTwig(ocIndexer: OCIndexer) {
    try {
        // Get active text editor
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showErrorMessage('No active editor found. Please open a file first.');
            return;
        }

        // Get the file path
        const filePath = editor.document.uri.fsPath;
        const fileDir = path.dirname(filePath);
        const fileName = path.basename(filePath);

        // Get template details from user
        const templateName = await vscode.window.showInputBox({
            prompt: 'Enter template name',
            placeHolder: 'e.g., product_list',
            value: fileName.replace('.twig', '')
        });
        
        if (!templateName) {
            return;
        }
        
        const templateType = await vscode.window.showQuickPick(
            ['Admin', 'Catalog'], 
            { placeHolder: 'Select template type' }
        );
        
        if (!templateType) {
            return;
        }
        
        const templateDescription = await vscode.window.showInputBox({
            prompt: 'Enter template description',
            placeHolder: `${templateType} template for ${templateName}`
        });
        
        if (templateDescription === undefined) {
            return;
        }

        // Generate template content
        let templateContent = '';
        
        if (templateType === 'Admin') {
            templateContent = `{{ header }}{{ column_left }}
<div id="content">
  <div class="page-header">
    <div class="container-fluid">
      <div class="pull-right">
        <button type="submit" form="form-module" data-toggle="tooltip" title="{{ button_save }}" class="btn btn-primary"><i class="fa fa-save"></i></button>
        <a href="{{ cancel }}" data-toggle="tooltip" title="{{ button_cancel }}" class="btn btn-default"><i class="fa fa-reply"></i></a>
      </div>
      <h1>{{ heading_title }}</h1>
      <ul class="breadcrumb">
        {% for breadcrumb in breadcrumbs %}
        <li><a href="{{ breadcrumb.href }}">{{ breadcrumb.text }}</a></li>
        {% endfor %}
      </ul>
    </div>
  </div>
  <div class="container-fluid">
    {% if error_warning %}
    <div class="alert alert-danger alert-dismissible"><i class="fa fa-exclamation-circle"></i> {{ error_warning }}
      <button type="button" class="close" data-dismiss="alert">&times;</button>
    </div>
    {% endif %}
    <div class="panel panel-default">
      <div class="panel-heading">
        <h3 class="panel-title"><i class="fa fa-pencil"></i> {{ text_edit }}</h3>
      </div>
      <div class="panel-body">
        <form action="{{ action }}" method="post" enctype="multipart/form-data" id="form-module" class="form-horizontal">
          <div class="form-group">
            <label class="col-sm-2 control-label" for="input-name">{{ entry_name }}</label>
            <div class="col-sm-10">
              <input type="text" name="name" value="{{ name }}" placeholder="{{ entry_name }}" id="input-name" class="form-control" />
              {% if error_name %}
              <div class="text-danger">{{ error_name }}</div>
              {% endif %}
            </div>
          </div>
          <div class="form-group">
            <label class="col-sm-2 control-label" for="input-status">{{ entry_status }}</label>
            <div class="col-sm-10">
              <select name="status" id="input-status" class="form-control">
                {% if status %}
                <option value="1" selected="selected">{{ text_enabled }}</option>
                <option value="0">{{ text_disabled }}</option>
                {% else %}
                <option value="1">{{ text_enabled }}</option>
                <option value="0" selected="selected">{{ text_disabled }}</option>
                {% endif %}
              </select>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</div>
{{ footer }}`;
        } else {
            templateContent = `<div class="container">
  <h1>{{ heading_title }}</h1>
  <div class="row">
    {% for item in items %}
    <div class="col-sm-4">
      <div class="card">
        <div class="card-body">
          <h5 class="card-title">{{ item.title }}</h5>
          <p class="card-text">{{ item.description }}</p>
          <a href="{{ item.link }}" class="btn btn-primary">{{ button_view }}</a>
        </div>
      </div>
    </div>
    {% endfor %}
  </div>
</div>`;
        }

        // Insert the template content
        await editor.edit(editBuilder => {
            const document = editor.document;
            const startPosition = new vscode.Position(0, 0);
            const endPosition = new vscode.Position(document.lineCount, 0);
            const range = new vscode.Range(startPosition, endPosition);
            
            editBuilder.replace(range, templateContent);
        });

        // Show success message
        vscode.window.showInformationMessage(`Twig template for ${templateName} generated successfully!`);
    } catch (error) {
        vscode.window.showErrorMessage(`Error generating Twig template: ${error instanceof Error ? error.message : String(error)}`);
    }
}
