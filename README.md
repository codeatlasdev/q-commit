# Q Commit

Generate commit messages using Amazon Q CLI for your staged changes.

## Features

- 🎯 One-click commit message generation
- ✨ Integrates directly with VS Code's Source Control
- 🤖 Powered by Amazon Q CLI
- ⚡ Fast and lightweight

## Requirements

- [Amazon Q CLI](https://aws.amazon.com/q/) installed and configured
- Git repository

## Usage

1. Stage your changes (`git add`)
2. Click the sparkle (✨) icon in the Source Control view
3. Review the generated commit message
4. Commit!

## Development

```bash
npm install
npm run watch  # Start watching for changes
# Press F5 to launch extension development host
```

## Build

```bash
npm run build
```

## Tech Stack

- TypeScript
- ESBuild (fast bundling)
- VS Code Extension API
