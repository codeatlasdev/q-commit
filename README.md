# Q Commit

[![CI](https://github.com/codeatlasdev/q-commit/actions/workflows/ci.yml/badge.svg)](https://github.com/codeatlasdev/q-commit/actions/workflows/ci.yml)
[![Visual Studio Marketplace Version](https://img.shields.io/visual-studio-marketplace/v/codeatlasdev.q-commit)](https://marketplace.visualstudio.com/items?itemName=codeatlasdev.q-commit)
[![Visual Studio Marketplace Installs](https://img.shields.io/visual-studio-marketplace/i/codeatlasdev.q-commit)](https://marketplace.visualstudio.com/items?itemName=codeatlasdev.q-commit)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Generate commit messages using Amazon Q CLI for your staged changes.

## Features

- 🎯 One-click commit message generation
- ✨ Integrates directly with VS Code's Source Control
- 🤖 Powered by Amazon Q CLI
- ⚡ Fast and lightweight

## Requirements

- [Amazon Q CLI](https://aws.amazon.com/q/) installed and configured
- Git repository

## Installation

Install from the [VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=codeatlasdev.q-commit):

```bash
code --install-extension codeatlasdev.q-commit
```

Or search for "Q Commit" in the Extensions view (`Ctrl+Shift+X`).

## Usage

1. Stage your changes (`git add`)
2. Click the sparkle (✨) icon in the Source Control view
3. Review the generated commit message
4. Commit!

## Development

### Setup

```bash
npm install
```

### Running the Extension

1. Press `F5` to open a new VS Code window with the extension loaded
2. Make changes to the code
3. Press `Ctrl+R` (or `Cmd+R` on macOS) in the extension development window to reload

### Watch Mode

For continuous development with automatic rebuilds and type checking:

```bash
npm run watch
```

This runs both esbuild and TypeScript compiler in watch mode simultaneously.

### Building

```bash
npm run build       # Development build
npm run package     # Production build with type checking
```

### Type Checking

```bash
npm run check-types
```

### Linting

```bash
npm run lint
```

## Tech Stack

- TypeScript
- esbuild (fast bundling)
- VS Code Extension API
- npm-run-all (parallel watch tasks)

## Project Structure

```
.
├── src/
│   ├── extension.ts    # Main extension entry point
│   ├── prompts.ts      # Q CLI prompts
│   └── utils.ts        # Helper functions
├── dist/               # Compiled output
├── .vscode/            # VS Code configuration
│   ├── launch.json     # Debug configuration
│   ├── tasks.json      # Build tasks
│   └── settings.json   # Workspace settings
└── esbuild.js          # Build configuration
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT © [CodeAtlas](https://github.com/codeatlasdev)
