# OpenCart AI Helper

A VS Code extension that helps generate OpenCart modules, modifiers, and templates using AI with an enhanced user interface.

## Features

- **AI-Powered Code Generation**: Create modules, OCMod modifiers, and templates with AI assistance
- **Modern User Interface**: Intuitive chat interface with file upload capabilities
- **Template Support**: Generate both Twig templates (OpenCart 3.x) and TPL templates (OpenCart 2.x)
- **Prompt Library**: Pre-built prompts for common OpenCart development tasks
- **Code Snippets**: Ready-to-use code snippets for faster development
- **Multiple LLM Providers**: Support for OpenAI, Google Gemini, Mistral, OpenRouter, and Llama

## Requirements

- VS Code 1.60.0 or higher
- OpenCart source files (for analysis and context)
- API key for your preferred LLM provider

## Getting Started

1. **Install the Extension**: Install from the VS Code Marketplace or using a VSIX file
2. **Open the AI Helper**: Click on the rocket icon in the Activity Bar
3. **Configure Settings**:
   - Set your working directory for output files
   - Set the OpenCart source directory
   - Choose your LLM provider and enter your API key
4. **Start Developing**: Use the chat interface to describe what you want to create

## Usage

### Generating Modules

1. Describe the module you want to create in the chat
2. The AI will generate the necessary files for your module
3. Files will be saved to your configured working directory

### Using Snippets

1. Open the Snippets view from the Activity Bar
2. Browse available snippets for PHP, Twig, and TPL files
3. Click on a snippet to insert it into your active editor

### Using the Prompt Library

1. Click on a prompt template in the Prompt Library section
2. Customize the pre-filled prompt as needed
3. Send your request to the AI

## Extension Settings

This extension contributes the following settings:

* `opencartAIHelper.llm.provider`: LLM provider to use (openai, gemini, mistral, openrouter, llama)
* `opencartAIHelper.llm.apiKey`: API key for the selected LLM provider
* `opencartAIHelper.llm.model`: Model to use for code generation
* `opencartAIHelper.llm.maxTokens`: Maximum number of tokens to generate
* `opencartAIHelper.ocSourcePath`: Path to OpenCart source files
* `opencartAIHelper.outputPath`: Path to save generated files
* `opencartAIHelper.ocVersion`: OpenCart version to use (auto, 2.0, 2.1, 2.2, 2.3, 3.0, 4.0)

## Release Notes

### 1.0.0

- Initial release with enhanced UI
- Added file upload capability
- Added prompt library
- Added support for multiple LLM providers
- Added token counter
- Added OpenCart version selector

---

## Development

### Building the Extension

1. Clone the repository
2. Run `npm install` to install dependencies
3. Run `npm run compile` to compile TypeScript
4. Press F5 to launch the extension in debug mode

### Creating a VSIX Package

Run `npx vsce package` to create a VSIX file for distribution.

## License

This extension is licensed under the MIT License.
