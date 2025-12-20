# Contributing to CodeSprout

Thank you for your interest in contributing to CodeSprout! This document provides guidelines and instructions for contributing to the project.

## Code of Conduct

By participating in this project, you agree to abide by our Code of Conduct. We are committed to providing a welcoming and inclusive environment for all contributors.

## How to Contribute

### Reporting Issues

Before submitting a new issue, please check the existing issues to avoid duplicates. When reporting a bug or suggesting an enhancement, please include:

- A clear and descriptive title
- Detailed steps to reproduce the issue (for bugs)
- Expected and actual behavior
- Screenshots if applicable
- Your environment information (VS Code version, OS, etc.)

### Suggesting Enhancements

We welcome ideas for new features or improvements! When suggesting an enhancement, please:

- Use a clear and descriptive title
- Provide a detailed explanation of the proposed feature
- Explain why this feature would be beneficial
- Include examples or mockups if possible

### Code Contributions

#### Development Setup

1. Fork the repository
2. Clone your fork:
   ```
   git clone https://github.com/your-username/codesprout.git
   ```
3. Install dependencies:
   ```
   cd codesprout
   npm install
   ```
4. Open the project in VS Code
5. Run the extension using `F5` to launch the debugger

#### Making Changes

1. Create a new branch for your feature or bugfix:
   ```
   git checkout -b feature/your-feature-name
   ```
2. Make your changes following the project's coding standards
3. Test your changes thoroughly
4. Commit your changes with a clear, descriptive commit message
5. Push to your fork:
   ```
   git push origin feature/your-feature-name
   ```
6. Submit a pull request to the main repository

#### Coding Standards

- Follow the existing code style and conventions
- Write clear, commented code
- Ensure all tests pass before submitting a pull request
- Update documentation as needed

#### Pull Request Process

1. Ensure your code follows the project's coding standards
2. Include a clear description of the changes
3. Reference any related issues
4. Be prepared to make revisions based on feedback
5. Wait for approval from project maintainers

## Project Structure

```
codesprout/
├── src/
│   ├── extension.ts     # Main extension logic
│   └── test/            # Test files
├── media/               # Images, styles, and scripts for the webview
├── out/                 # Compiled output (generated)
├── .vscode/             # VS Code configuration
├── package.json         # Extension manifest
└── tsconfig.json        # TypeScript configuration
```

## Architecture Overview

CodeSprout follows a client-side only architecture with no external dependencies:

- **Extension Backend**: Written in TypeScript, handles logic, state management, and VS Code API interactions
- **Webview Frontend**: Provides the UI using HTML, CSS, and JavaScript
- **Data Storage**: Uses VS Code's globalState for persistent storage
- **No External Services**: All functionality works offline

## Key Components

### 1. Extension Core (`src/extension.ts`)

- Implements the `activate` and `deactivate` functions
- Manages the webview view provider
- Handles hydration tracking logic
- Manages state persistence

### 2. Webview UI (`media/`)

- `main.css`: Styles for the webview
- `main.js`: Client-side interactivity
- `sprout-icon.svg`: Extension icon

### 3. Data Model

- `DailyHydrationRecord`: Represents a day's hydration data
- `HydrationHistory`: Collection of daily records
- Stored in VS Code's globalState

## Development Guidelines

### 1. Privacy First

- All data must remain local to the user's machine
- No network calls or external services
- No data collection or telemetry

### 2. Performance

- Minimize resource usage
- Optimize for quick loading
- Avoid blocking operations

### 3. User Experience

- Maintain the cute, non-intrusive aesthetic
- Preserve backward compatibility
- Follow VS Code's UI patterns

### 4. Gamification Principles

- Keep interactions rewarding and fun
- Maintain emotional engagement
- Support habit formation

## Testing

While we don't have automated tests yet, please manually test:

1. Extension activation and deactivation
2. Water tracking functionality
3. Streak calculation
4. Settings persistence
5. Webview rendering
6. Chart visualization
7. Different VS Code themes

## Release Process

1. Update version in `package.json`
2. Update `CHANGELOG.md` with release notes
3. Create a git tag for the release
4. Package the extension
5. Publish to the VS Code Marketplace

## Getting Help

If you need help or have questions:

- Check the existing documentation
- Open an issue with your question
- Tag maintainers for urgent issues

Thank you for contributing to CodeSprout!