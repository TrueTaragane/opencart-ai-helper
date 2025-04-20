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


# OpenCart AI Helper

Расширение для VS Code, которое помогает генерировать модули, модификаторы и шаблоны OpenCart с использованием искусственного интеллекта и улучшенным пользовательским интерфейсом.

## Возможности

- **Генерация кода с помощью ИИ**: Создание модулей, OCMod модификаторов и шаблонов с помощью искусственного интеллекта
- **Современный пользовательский интерфейс**: Интуитивно понятный интерфейс чата с возможностью загрузки файлов
- **Поддержка шаблонов**: Генерация шаблонов Twig (OpenCart 3.x) и TPL (OpenCart 2.x)
- **Библиотека промптов**: Готовые промпты для типовых задач разработки OpenCart
- **Сниппеты кода**: Готовые к использованию фрагменты кода для ускорения разработки
- **Несколько LLM-провайдеров**: Поддержка OpenAI, Google Gemini, Mistral, OpenRouter и Llama

## Требования

- VS Code 1.60.0 или выше
- Исходные файлы OpenCart (для анализа и контекста)
- API-ключ для выбранного LLM-провайдера

## Начало работы

1. **Установите расширение**: Установите из VS Code Marketplace или с помощью VSIX-файла
2. **Откройте AI Helper**: Нажмите на иконку ракеты в панели действий
3. **Настройте параметры**:
   - Укажите рабочую директорию для выходных файлов
   - Укажите директорию с исходными файлами OpenCart
   - Выберите LLM-провайдера и введите ваш API-ключ
4. **Начните разработку**: Используйте интерфейс чата, чтобы описать, что вы хотите создать

## Использование

### Генерация модулей

1. Опишите модуль, который вы хотите создать, в чате
2. ИИ сгенерирует необходимые файлы для вашего модуля
3. Файлы будут сохранены в указанную рабочую директорию

### Использование сниппетов

1. Откройте представление Snippets (Сниппеты) из панели действий
2. Просмотрите доступные сниппеты для файлов PHP, Twig и TPL
3. Нажмите на сниппет, чтобы вставить его в активный редактор

### Использование библиотеки промптов

1. Нажмите на шаблон промпта в разделе Prompt Library (Библиотека промптов)
2. Настройте предзаполненный промпт по необходимости
3. Отправьте запрос искусственному интеллекту

## Настройки расширения

Это расширение добавляет следующие настройки:

* `opencartAIHelper.llm.provider`: LLM-провайдер для использования (openai, gemini, mistral, openrouter, llama)
* `opencartAIHelper.llm.apiKey`: API-ключ для выбранного LLM-провайдера
* `opencartAIHelper.llm.model`: Модель для генерации кода
* `opencartAIHelper.llm.maxTokens`: Максимальное количество токенов для генерации
* `opencartAIHelper.ocSourcePath`: Путь к исходным файлам OpenCart
* `opencartAIHelper.outputPath`: Путь для сохранения сгенерированных файлов
* `opencartAIHelper.ocVersion`: Версия OpenCart для использования (auto, 2.0, 2.1, 2.2, 2.3, 3.0, 4.0)

## Примечания к выпуску

### 1.0.0

- Первоначальный выпуск с улучшенным пользовательским интерфейсом
- Добавлена возможность загрузки файлов
- Добавлена библиотека промптов
- Добавлена поддержка нескольких LLM-провайдеров
- Добавлен счетчик токенов
- Добавлен селектор версии OpenCart

---

## Разработка

### Сборка расширения

1. Клонируйте репозиторий
2. Выполните `npm install` для установки зависимостей
3. Выполните `npm run compile` для компиляции TypeScript
4. Нажмите F5 для запуска расширения в режиме отладки

### Создание VSIX-пакета

Выполните `npx vsce package` для создания VSIX-файла для распространения.

## Установка

### Установка из VSIX-файла

1. Скачайте VSIX-файл из [последнего релиза](https://github.com/TrueTaragane/opencart-ai-helper/releases/latest)
2. В VS Code перейдите в раздел Extensions (Расширения) с помощью сочетания клавиш `Ctrl+Shift+X` или нажав на значок расширений в боковой панели
3. Нажмите на "..." (три точки) в правом верхнем углу панели расширений
4. Выберите "Install from VSIX..."
5. Найдите и выберите скачанный файл VSIX
6. Перезапустите VS Code после установки
7. Иконка OpenCart AI Helper должна появиться в левой колонке (панель действий)

### Проверка установки

После установки и перезапуска VS Code:
1. В левой колонке должна появиться иконка ракеты
2. При нажатии на иконку должны отображаться представления:
   - Modules (Модули)
   - Snippets (Сниппеты)
   - AI Chat (ИИ Чат)
   - Tools (Инструменты)

Если иконка не появилась:
1. Нажмите `Ctrl+Shift+P` для открытия палитры команд
2. Введите "Developer: Reload Window" и нажмите Enter
3. Проверьте снова, появилась ли иконка

## Лицензия

Это расширение лицензировано под лицензией MIT.

