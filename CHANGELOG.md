# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.1] - 2024-01-15

### Fixed
- Config file loading in production environment
- Added config.json to dist folder during build
- Improved error logging for config file operations

### Changed
- Updated config file path resolution to use `process.cwd()`
- Enhanced build process to include config.json

## [1.0.0] - 2024-01-15

### Added
- Complete modernization of codebase
- ES Modules support
- Class-based architecture
- Comprehensive error handling
- Enhanced type safety
- Dark mode support in documentation
- Detailed attribution section

### Changed
- Updated all dependencies to latest versions
- Improved project structure
- Enhanced documentation
- Better code organization
- Modern JavaScript practices

### Updated Dependencies
- @octokit/graphql: 4.6.2 → 7.0.2
- fs-extra: 9.1.0 → 11.1.1
- simple-git: 2.39.0 → 3.19.1
- Node.js requirement: 20.x

[1.0.1]: https://github.com/Zaid-maker/top-github-users-action/compare/v1.0.0...v1.0.1
[1.0.0]: https://github.com/Zaid-maker/top-github-users-action/releases/tag/v1.0.0

## Historical Note
This project was originally created by [gayanvoice](https://github.com/gayanvoice) and has been modernized and maintained by [Zaid Hafeez](https://github.com/Zaid-maker). The v1.0.0 release represents a complete modernization of the codebase while maintaining the original functionality.
