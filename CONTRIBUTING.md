# Contributing to Q Commit

Thank you for your interest in contributing! 🎉

## Development Setup

1. Fork and clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start development mode:
   ```bash
   npm run watch
   ```

## Making Changes

1. Create a new branch:
   ```bash
   git checkout -b feat/your-feature
   ```

2. Make your changes

3. The pre-commit hook will automatically:
   - Run ESLint and fix issues
   - Format code with Prettier
   - Run type checking

4. Commit your changes:
   ```bash
   git commit -m "feat: your feature description"
   ```

## Commit Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `chore:` - Maintenance tasks
- `refactor:` - Code refactoring
- `test:` - Adding tests

## Pull Request Process

1. Push your branch to your fork
2. Open a Pull Request against `main`
3. Fill out the PR template
4. Wait for CI checks to pass
5. Request review from maintainers
6. Address any feedback

## Code Quality

All PRs must:
- ✅ Pass ESLint checks
- ✅ Pass TypeScript type checking
- ✅ Pass CI build
- ✅ Be approved by at least one maintainer

## Questions?

Open an issue or reach out to the maintainers!
