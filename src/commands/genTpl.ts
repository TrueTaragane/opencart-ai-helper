import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { OCIndexer } from '../ocIndexer';

/**
 * Generate a TPL template
 * @param ocIndexer The OpenCart structure indexer
 */
export async function genTpl(ocIndexer: OCIndexer) {
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
            value: fileName.replace('.tpl', '')
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
            templateContent = `<?php echo $header; ?><?php echo $column_left; ?>
<div id="content">
  <div class="page-header">
    <div class="container-fluid">
      <div class="pull-right">
        <button type="submit" form="form-module" data-toggle="tooltip" title="<?php echo $button_save; ?>" class="btn btn-primary"><i class="fa fa-save"></i></button>
        <a href="<?php echo $cancel; ?>" data-toggle="tooltip" title="<?php echo $button_cancel; ?>" class="btn btn-default"><i class="fa fa-reply"></i></a>
      </div>
      <h1><?php echo $heading_title; ?></h1>
      <ul class="breadcrumb">
        <?php foreach ($breadcrumbs as $breadcrumb) { ?>
        <li><a href="<?php echo $breadcrumb['href']; ?>"><?php echo $breadcrumb['text']; ?></a></li>
        <?php } ?>
      </ul>
    </div>
  </div>
  <div class="container-fluid">
    <?php if ($error_warning) { ?>
    <div class="alert alert-danger alert-dismissible"><i class="fa fa-exclamation-circle"></i> <?php echo $error_warning; ?>
      <button type="button" class="close" data-dismiss="alert">&times;</button>
    </div>
    <?php } ?>
    <div class="panel panel-default">
      <div class="panel-heading">
        <h3 class="panel-title"><i class="fa fa-pencil"></i> <?php echo $text_edit; ?></h3>
      </div>
      <div class="panel-body">
        <form action="<?php echo $action; ?>" method="post" enctype="multipart/form-data" id="form-module" class="form-horizontal">
          <div class="form-group">
            <label class="col-sm-2 control-label" for="input-name"><?php echo $entry_name; ?></label>
            <div class="col-sm-10">
              <input type="text" name="name" value="<?php echo $name; ?>" placeholder="<?php echo $entry_name; ?>" id="input-name" class="form-control" />
              <?php if ($error_name) { ?>
              <div class="text-danger"><?php echo $error_name; ?></div>
              <?php } ?>
            </div>
          </div>
          <div class="form-group">
            <label class="col-sm-2 control-label" for="input-status"><?php echo $entry_status; ?></label>
            <div class="col-sm-10">
              <select name="status" id="input-status" class="form-control">
                <?php if ($status) { ?>
                <option value="1" selected="selected"><?php echo $text_enabled; ?></option>
                <option value="0"><?php echo $text_disabled; ?></option>
                <?php } else { ?>
                <option value="1"><?php echo $text_enabled; ?></option>
                <option value="0" selected="selected"><?php echo $text_disabled; ?></option>
                <?php } ?>
              </select>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</div>
<?php echo $footer; ?>`;
        } else {
            templateContent = `<div class="container">
  <h1><?php echo $heading_title; ?></h1>
  <div class="row">
    <?php foreach ($items as $item) { ?>
    <div class="col-sm-4">
      <div class="card">
        <div class="card-body">
          <h5 class="card-title"><?php echo $item['title']; ?></h5>
          <p class="card-text"><?php echo $item['description']; ?></p>
          <a href="<?php echo $item['link']; ?>" class="btn btn-primary"><?php echo $button_view; ?></a>
        </div>
      </div>
    </div>
    <?php } ?>
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
        vscode.window.showInformationMessage(`TPL template for ${templateName} generated successfully!`);
    } catch (error) {
        vscode.window.showErrorMessage(`Error generating TPL template: ${error instanceof Error ? error.message : String(error)}`);
    }
}
