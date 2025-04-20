import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { OCIndexer } from '../ocIndexer';

/**
 * Generate a module
 * @param ocIndexer The OpenCart structure indexer
 */
export async function genModule(ocIndexer: OCIndexer) {
    try {
        // Get module details from user
        const moduleName = await vscode.window.showInputBox({
            prompt: 'Enter module name',
            placeHolder: 'e.g., my_module'
        });
        
        if (!moduleName) {
            return;
        }
        
        const moduleType = await vscode.window.showQuickPick(
            ['Admin', 'Catalog', 'Both'], 
            { placeHolder: 'Select module type' }
        );
        
        if (!moduleType) {
            return;
        }
        
        const moduleDescription = await vscode.window.showInputBox({
            prompt: 'Enter module description',
            placeHolder: 'e.g., My custom module'
        });
        
        if (moduleDescription === undefined) {
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
        const modulePath = path.join(workspaceFolder.uri.fsPath, outputPath, moduleName);
        
        // Create module directory
        if (!fs.existsSync(modulePath)) {
            fs.mkdirSync(modulePath, { recursive: true });
        }
        
        // Show progress
        await vscode.window.withProgress({
            location: vscode.ProgressLocation.Notification,
            title: "Generating module",
            cancellable: false
        }, async (progress) => {
            progress.report({ message: "Creating module structure..." });
            
            // Create module structure
            if (moduleType === 'Admin' || moduleType === 'Both') {
                createAdminModule(modulePath, moduleName, moduleDescription);
            }
            
            if (moduleType === 'Catalog' || moduleType === 'Both') {
                createCatalogModule(modulePath, moduleName, moduleDescription);
            }
            
            progress.report({ message: "Module generated successfully!" });
        });
        
        // Show success message
        vscode.window.showInformationMessage(`Module ${moduleName} generated successfully!`);
        
        // Open module directory
        vscode.commands.executeCommand('vscode.openFolder', vscode.Uri.file(modulePath), true);
    } catch (error) {
        vscode.window.showErrorMessage(`Error generating module: ${error instanceof Error ? error.message : String(error)}`);
    }
}

/**
 * Create admin module
 */
function createAdminModule(modulePath: string, moduleName: string, moduleDescription: string) {
    // Create admin directory
    const adminPath = path.join(modulePath, 'admin');
    if (!fs.existsSync(adminPath)) {
        fs.mkdirSync(adminPath, { recursive: true });
    }
    
    // Create controller directory
    const controllerPath = path.join(adminPath, 'controller', 'extension', 'module');
    if (!fs.existsSync(controllerPath)) {
        fs.mkdirSync(controllerPath, { recursive: true });
    }
    
    // Create controller file
    const controllerFile = path.join(controllerPath, `${moduleName}.php`);
    const controllerContent = `<?php
class ControllerExtensionModule${toCamelCase(moduleName)} extends Controller {
    private $error = array();
    
    public function index() {
        $this->load->language('extension/module/${moduleName}');
        
        $this->document->setTitle($this->language->get('heading_title'));
        
        $this->load->model('setting/setting');
        
        if (($this->request->server['REQUEST_METHOD'] == 'POST') && $this->validate()) {
            $this->model_setting_setting->editSetting('module_${moduleName}', $this->request->post);
            
            $this->session->data['success'] = $this->language->get('text_success');
            
            $this->response->redirect($this->url->link('marketplace/extension', 'user_token=' . $this->session->data['user_token'] . '&type=module', true));
        }
        
        if (isset($this->error['warning'])) {
            $data['error_warning'] = $this->error['warning'];
        } else {
            $data['error_warning'] = '';
        }
        
        $data['breadcrumbs'] = array();
        
        $data['breadcrumbs'][] = array(
            'text' => $this->language->get('text_home'),
            'href' => $this->url->link('common/dashboard', 'user_token=' . $this->session->data['user_token'], true)
        );
        
        $data['breadcrumbs'][] = array(
            'text' => $this->language->get('text_extension'),
            'href' => $this->url->link('marketplace/extension', 'user_token=' . $this->session->data['user_token'] . '&type=module', true)
        );
        
        $data['breadcrumbs'][] = array(
            'text' => $this->language->get('heading_title'),
            'href' => $this->url->link('extension/module/${moduleName}', 'user_token=' . $this->session->data['user_token'], true)
        );
        
        $data['action'] = $this->url->link('extension/module/${moduleName}', 'user_token=' . $this->session->data['user_token'], true);
        
        $data['cancel'] = $this->url->link('marketplace/extension', 'user_token=' . $this->session->data['user_token'] . '&type=module', true);
        
        if (isset($this->request->post['module_${moduleName}_status'])) {
            $data['module_${moduleName}_status'] = $this->request->post['module_${moduleName}_status'];
        } else {
            $data['module_${moduleName}_status'] = $this->config->get('module_${moduleName}_status');
        }
        
        $data['header'] = $this->load->controller('common/header');
        $data['column_left'] = $this->load->controller('common/column_left');
        $data['footer'] = $this->load->controller('common/footer');
        
        $this->response->setOutput($this->load->view('extension/module/${moduleName}', $data));
    }
    
    protected function validate() {
        if (!$this->user->hasPermission('modify', 'extension/module/${moduleName}')) {
            $this->error['warning'] = $this->language->get('error_permission');
        }
        
        return !$this->error;
    }
    
    public function install() {
        $this->load->model('setting/setting');
        $this->model_setting_setting->editSetting('module_${moduleName}', array(
            'module_${moduleName}_status' => 0
        ));
    }
    
    public function uninstall() {
        $this->load->model('setting/setting');
        $this->model_setting_setting->deleteSetting('module_${moduleName}');
    }
}`;
    
    fs.writeFileSync(controllerFile, controllerContent);
    
    // Create language directory
    const languagePath = path.join(adminPath, 'language', 'en-gb', 'extension', 'module');
    if (!fs.existsSync(languagePath)) {
        fs.mkdirSync(languagePath, { recursive: true });
    }
    
    // Create language file
    const languageFile = path.join(languagePath, `${moduleName}.php`);
    const languageContent = `<?php
// Heading
$_['heading_title']    = '${moduleDescription}';

// Text
$_['text_extension']   = 'Extensions';
$_['text_success']     = 'Success: You have modified ${moduleDescription} module!';
$_['text_edit']        = 'Edit ${moduleDescription} Module';

// Entry
$_['entry_status']     = 'Status';

// Error
$_['error_permission'] = 'Warning: You do not have permission to modify ${moduleDescription} module!';`;
    
    fs.writeFileSync(languageFile, languageContent);
    
    // Create view directory
    const viewPath = path.join(adminPath, 'view', 'template', 'extension', 'module');
    if (!fs.existsSync(viewPath)) {
        fs.mkdirSync(viewPath, { recursive: true });
    }
    
    // Create view file
    const viewFile = path.join(viewPath, `${moduleName}.twig`);
    const viewContent = `{{ header }}{{ column_left }}
<div id="content">
  <div class="page-header">
    <div class="container-fluid">
      <div class="pull-right">
        <button type="submit" form="form-module" data-toggle="tooltip" title="{{ button_save }}" class="btn btn-primary"><i class="fa fa-save"></i></button>
        <a href="{{ cancel }}" data-toggle="tooltip" title="{{ button_cancel }}" class="btn btn-default"><i class="fa fa-reply"></i></a></div>
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
            <label class="col-sm-2 control-label" for="input-status">{{ entry_status }}</label>
            <div class="col-sm-10">
              <select name="module_${moduleName}_status" id="input-status" class="form-control">
                {% if module_${moduleName}_status %}
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
    
    fs.writeFileSync(viewFile, viewContent);
}

/**
 * Create catalog module
 */
function createCatalogModule(modulePath: string, moduleName: string, moduleDescription: string) {
    // Create catalog directory
    const catalogPath = path.join(modulePath, 'catalog');
    if (!fs.existsSync(catalogPath)) {
        fs.mkdirSync(catalogPath, { recursive: true });
    }
    
    // Create controller directory
    const controllerPath = path.join(catalogPath, 'controller', 'extension', 'module');
    if (!fs.existsSync(controllerPath)) {
        fs.mkdirSync(controllerPath, { recursive: true });
    }
    
    // Create controller file
    const controllerFile = path.join(controllerPath, `${moduleName}.php`);
    const controllerContent = `<?php
class ControllerExtensionModule${toCamelCase(moduleName)} extends Controller {
    public function index($setting) {
        $this->load->language('extension/module/${moduleName}');
        
        $data['heading_title'] = $this->language->get('heading_title');
        
        $this->load->model('extension/module/${moduleName}');
        
        $data['items'] = array();
        
        // Add your module logic here
        
        return $this->load->view('extension/module/${moduleName}', $data);
    }
}`;
    
    fs.writeFileSync(controllerFile, controllerContent);
    
    // Create model directory
    const modelPath = path.join(catalogPath, 'model', 'extension', 'module');
    if (!fs.existsSync(modelPath)) {
        fs.mkdirSync(modelPath, { recursive: true });
    }
    
    // Create model file
    const modelFile = path.join(modelPath, `${moduleName}.php`);
    const modelContent = `<?php
class ModelExtensionModule${toCamelCase(moduleName)} extends Model {
    // Add your model methods here
}`;
    
    fs.writeFileSync(modelFile, modelContent);
    
    // Create language directory
    const languagePath = path.join(catalogPath, 'language', 'en-gb', 'extension', 'module');
    if (!fs.existsSync(languagePath)) {
        fs.mkdirSync(languagePath, { recursive: true });
    }
    
    // Create language file
    const languageFile = path.join(languagePath, `${moduleName}.php`);
    const languageContent = `<?php
// Heading
$_['heading_title'] = '${moduleDescription}';

// Text
$_['text_tax']      = 'Ex Tax:';`;
    
    fs.writeFileSync(languageFile, languageContent);
    
    // Create view directory
    const viewPath = path.join(catalogPath, 'view', 'theme', 'default', 'template', 'extension', 'module');
    if (!fs.existsSync(viewPath)) {
        fs.mkdirSync(viewPath, { recursive: true });
    }
    
    // Create view file
    const viewFile = path.join(viewPath, `${moduleName}.twig`);
    const viewContent = `<div class="module-${moduleName}">
  <h3>{{ heading_title }}</h3>
  <div class="row">
    {% for item in items %}
    <div class="col-lg-3 col-md-3 col-sm-6 col-xs-12">
      <div class="item">
        <!-- Add your module content here -->
      </div>
    </div>
    {% endfor %}
  </div>
</div>`;
    
    fs.writeFileSync(viewFile, viewContent);
}

/**
 * Convert string to camel case
 */
function toCamelCase(str: string): string {
    return str.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('');
}
