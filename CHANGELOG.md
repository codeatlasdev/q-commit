# Change Log

All notable changes to the "Q Commit" extension will be documented in this file.

## [0.0.3] - 2026-01-07

### Changed
- Switch from Amazon Q CLI to Kiro CLI
- Use claude-haiku-4.5 model by default (2x faster)
- Simplified prompt for faster execution

### Added
- Settings panel with configurable options:
  - Model selection (haiku-4.5, sonnet-4, sonnet-4.5)
  - Toggle output panel visibility
  - Custom prompt support
- Keyboard shortcut: Ctrl+Shift+G (Cmd+Shift+G on Mac)
- Cancellable generation (click Cancel on notification)
- Multi-repository support (picker when multiple repos open)
- CLI installation check with friendly error message

## [0.0.2] - 2025-10-31

### Changed
- Optimize package size by excluding .github files
- Add CI/CD workflows for automated testing and releases
- Add issue and PR templates

### Fixed
- ESLint error with ANSI escape codes in regex

## [0.0.1] - 2025-10-31

### Added
- Initial release
- Generate commit messages using Amazon Q CLI
- One-click integration with VS Code Source Control
- Support for staged changes analysis
- Real-time output logging for debugging
