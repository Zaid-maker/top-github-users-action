# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## Migration Guide

### Migrating from gayanvoice/top-github-users-action

This guide helps you migrate from the original action (gayanvoice/top-github-users-action) to this modernized version.

#### Key Differences
- Modernized JavaScript codebase with better reliability
- Improved error handling and logging
- Updated dependencies for better security
- Enhanced documentation and dark mode support
- Maintained same core functionality and data format

#### Steps to Migrate

1. Update your workflow file from:
```yaml
# Old workflow
name: Top GitHub Users
on:
  schedule:
    - cron: '0 0 * * *'
jobs:
  main:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: gayanvoice/top-github-users-action@master
        env:
          CUSTOM_TOKEN: ${{ secrets.CUSTOM_TOKEN }}
```

To:
```yaml
# New workflow
name: Top GitHub Users
on:
  schedule:
    - cron: '0 0 * * *'
  workflow_dispatch:      # Added for manual triggers
jobs:
  main:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4    # Updated checkout version
      - uses: Zaid-maker/top-github-users-action@v1.0.1
        with:                        # Changed from env to with
          CUSTOM_TOKEN: ${{ secrets.CUSTOM_TOKEN }}
```

2. Repository Structure:
   - Keep your existing `config.json` - it's compatible
   - Keep your existing documentation files
   - Keep your existing README.md customizations

3. No Data Migration Needed:
   - The output format remains the same
   - Existing statistics will be preserved
   - Generated markdown files are compatible

4. Verify Your Token:
   - Ensure your CUSTOM_TOKEN has required permissions
   - Token needs repo and user scopes
   - Check token expiration

5. Troubleshooting Common Issues:
   - If the action fails, check the detailed error logs
   - Verify your config.json is in the repository root
   - Make sure your repository has Actions enabled
   - Check if the token has sufficient permissions

Need help? Open an issue at: https://github.com/Zaid-maker/top-github-users-action/issues

## [1.0.2] - 2024-01-15

### Fixed
- Config file content access in GitHubUsersMonitor
- Config validation for required sections
- Error messages for config loading
- Path to devMode setting in config

### Added
- Better error logging for config issues
- Config file validation checks
- Detailed error messages for troubleshooting

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

[1.0.2]: https://github.com/Zaid-maker/top-github-users-action/compare/v1.0.1...v1.0.2
[1.0.1]: https://github.com/Zaid-maker/top-github-users-action/compare/v1.0.0...v1.0.1
[1.0.0]: https://github.com/Zaid-maker/top-github-users-action/releases/tag/v1.0.0

## Historical Note
This project was originally created by [gayanvoice](https://github.com/gayanvoice) and has been modernized and maintained by [Zaid Hafeez](https://github.com/Zaid-maker). The v1.0.0 release represents a complete modernization of the codebase while maintaining the original functionality.
