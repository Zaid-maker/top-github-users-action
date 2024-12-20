# Top GitHub Users Action <img src="https://github.githubassets.com/images/modules/site/features/actions-icon-actions.svg" height=48 width=48 /> [<img alt="Image of my-profile-views-counter" src="https://github.com/gayanvoice/my-profile-views-counter/blob/master/graph/373376349/small/week.png" height="20">](https://github.com/gayanvoice/my-profile-views-counter/blob/master/readme/373376349/week.md)
[![Image of my-profile-views-counter](https://github.com/gayanvoice/my-profile-views-counter/blob/master/svg/373376349/badge.svg)](https://github.com/gayanvoice/my-profile-views-counter/blob/master/readme/373376349/week.md)

> **DISCLAIMER**: This repository is a modernized fork of the original work by [gayanvoice](https://github.com/gayanvoice). The codebase has been updated with modern JavaScript practices, improved error handling, and current dependencies while maintaining the original functionality. This fork aims to ensure the project remains reliable and maintainable for future use.

A modern GitHub Action to track and analyze top GitHub users by country using the GitHub GraphQL API. This action generates detailed rankings and insights about the most active GitHub users in different countries. Visit [Zaid-maker/top-github-users](https://github.com/Zaid-maker/top-github-users) for the full list.

## Features

- 🌍 Track GitHub users by country and city
- 📊 Generate detailed user rankings based on:
  - Public contributions
  - Total contributions
  - Follower count
- 🔄 Automatic daily updates
- 📈 Caching for better performance
- 🎯 Configurable tracking parameters
- 📝 Markdown and HTML report generation

## How It Works

The action uses a modern, class-based architecture to efficiently track and analyze GitHub users:

1. **Configuration**: Countries and cities are defined in `config.json` using a JSON Schema for validation
2. **Data Collection**: Uses `@octokit/graphql` to fetch user data via GitHub's GraphQL API
3. **Caching**: Stores user data in `./cache` directory with country-specific JSON files
4. **Checkpointing**: Uses `checkpoint.json` to track progress and ensure reliable updates
5. **Report Generation**: Creates formatted markdown reports in `./docs` with user rankings

## Requirements

- Node.js 20.x or later
- GitHub Personal Access Token with required permissions
- GitHub Actions enabled repository

## Technologies

<div align="center">
  <table>
    <tr>
      <td align="center">
        <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript">
          <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/javascript/javascript-original.svg" width="100" alt="JavaScript"/>
          <br>JavaScript
        </a>
      </td>
      <td align="center">
        <a href="https://github.com/features/actions">
          <img src="https://raw.githubusercontent.com/github/explore/2c7e603b797535e5ad8b4beb575ab3b7354666e1/topics/actions/actions.png" width="100" alt="GitHub Actions"/>
          <br>GitHub Actions
        </a>
      </td>
      <td align="center">
        <a href="https://nodejs.org/">
          <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/nodejs/nodejs-original.svg" width="100" alt="Node.js"/>
          <br>Node.js
        </a>
      </td>
      <td align="center">
        <a href="https://graphql.org/">
          <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/graphql/graphql-plain.svg" width="100" alt="GraphQL"/>
          <br>GraphQL
        </a>
      </td>
      <td align="center">
        <a href="https://github.com/">
          <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/github/github-original.svg" width="100" alt="GitHub"/>
          <br>GitHub
        </a>
      </td>
    </tr>
  </table>
</div>

## Setup Guide

### 1. Repository Setup
Create a new repository named `top-github-users`

### 2. Authentication Setup
1. Create a GitHub Personal Access Token (Classic) with these permissions:
   - `repo` (Full control)
   - `workflow`
   - `read:org`
   - `read:user`
2. Add the token as a repository secret:
   - Go to Settings → Secrets and variables → Actions
   - Create new secret
   - Name: `CUSTOM_TOKEN`
   - Value: Your personal access token

### 3. Configuration Files

Create these configuration files in your repository:

#### checkpoint.json
```json
{
  "checkpoint": 0
}
```

#### config.json
```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "GitHub Users Monitor Configuration",
  "description": "Configuration for tracking top GitHub users by country",
  "version": "2.0.0",
  "settings": {
    "devMode": false,
    "minUsersThreshold": 750,
    "maxErrorIterations": 4,
    "updateFrequency": "daily"
  },
  "locations": [
    {
      "country": "afghanistan",
      "geoName": "Afghanistan",
      "cities": ["kabul", "kandahar", "herat", "kunduz", "lashkargah", "ghazni", "khost", "zaranj"],
      "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/9/9a/Flag_of_Afghanistan.svg"
    }
  ]
}
```

### 4. Workflow Setup

Create `.github/workflows/top-users.yml`:

```yaml
name: Top GitHub Users
on:
  schedule:
    - cron: '0 0 * * *'  # Runs daily at midnight
  workflow_dispatch:      # Allows manual triggers

jobs:
  update-users:
    name: Update GitHub Users Rankings
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - uses: Zaid-maker/top-github-users-action@master
        env:
          CUSTOM_TOKEN: ${{ secrets.CUSTOM_TOKEN }}
```

## Configuration Options

The `config.json` file supports these settings:

```json
{
  "settings": {
    "devMode": false,           // Enable/disable development mode
    "minUsersThreshold": 750,   // Minimum users to track per country
    "maxErrorIterations": 4,    // Max retry attempts on error
    "updateFrequency": "daily"  // Update frequency
  }
}
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

## Credits and Attribution

### Original Project
- **Creator**: [Gayan Kuruppu](https://github.com/gayanvoice)
- **Original Repository**: [gayanvoice/top-github-users](https://github.com/gayanvoice/top-github-users)
- **Initial Release**: 2021
- **Original Features**:
  - GitHub user tracking by country
  - Public contribution rankings
  - Automated data collection
  - Basic documentation site

### Current Maintenance
- **Maintainer**: [Zaid Hafeez](https://github.com/Zaid-maker)
- **Current Repository**: [Zaid-maker/top-github-users-action](https://github.com/Zaid-maker/top-github-users-action)
- **Major Updates**:
  - Complete ES Module conversion
  - Modern JavaScript practices
  - Enhanced error handling
  - Improved documentation
  - Updated dependencies
  - Better type safety
  - Performance optimizations

### Acknowledgments
This project builds upon the excellent foundation laid by Gayan Kuruppu. The current version maintains the original vision while modernizing the codebase for better maintainability and reliability.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

<table>
	<tr>
		<td>
			Don't forget to star ⭐ this repository
		</td>
	</tr>
</table>
